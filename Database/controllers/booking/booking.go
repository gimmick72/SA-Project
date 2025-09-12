package controllers

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"Database/configs"
	"Database/entity"
)

type CreateBookingPayload struct {
	FirstName   string `json:"firstName"   binding:"required"`
	LastName    string `json:"lastName"    binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	ServiceID   uint   `json:"service_id"  binding:"required"`
	DateText    string `json:"dateText"    binding:"required"`                            // "YYYY-MM-DD"
	TimeSlot    string `json:"timeSlot"    binding:"required,oneof=morning afternoon evening"`
	ServiceName string    `json:"service_name"`
}


// POST /api/bookings
func CreateBooking(c *gin.Context) {
    var p CreateBookingPayload
    if err := c.ShouldBindJSON(&p); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
        return
    }

    d, err := time.Parse("2006-01-02", p.DateText)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
        return
    }
    d = normalizeUTCDate(d)

    tx := configs.DB.Begin()
    defer func() {
        if r := recover(); r != nil { tx.Rollback() }
    }()

    // ---- NEW: ห้ามจองวันเดียวกันซ้ำ (ยกเว้นเคสที่ถูกยกเลิกแล้ว) ----
    var cnt int64
    if err := tx.Model(&entity.Booking{}).
        Where("phone_number = ? AND date = ? AND status <> ?", p.PhoneNumber, d, "cancelled").
        Count(&cnt).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    if cnt > 0 {
        tx.Rollback()
        c.JSON(http.StatusConflict, gin.H{"error": "ผู้ใช้นี้มีการจองในวันดังกล่าวอยู่แล้ว"})
        return
    }
    // -------------------------------------------------------------

    // lock หา slot ว่าง
    var slot entity.QueueSlot
    if err := tx.
        Clauses(clause.Locking{Strength: "UPDATE"}).
        Where("date = ? AND segment = ? AND capacity > used", d, p.TimeSlot).
        Order("hhmm asc").
        First(&slot).Error; err != nil {

        if errors.Is(err, gorm.ErrRecordNotFound) {
            tx.Rollback()
            c.JSON(http.StatusConflict, gin.H{"error": "no free slot"})
            return
        }
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // บันทึกการจอง
    b := entity.Booking{
        FirstName:   p.FirstName,
        LastName:    p.LastName,
        PhoneNumber: p.PhoneNumber,
        ServiceID:   p.ServiceID,
        SlotID:      slot.ID,
        Date:        d,
        HHMM:        slot.HHMM,
        Segment:     p.TimeSlot,
       
    }
    if err := tx.Create(&b).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // เพิ่ม used
    if err := tx.Model(&slot).UpdateColumn("used", gorm.Expr("used + 1")).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "id":      b.ID,
        "hhmm":    b.HHMM,
        "segment": b.Segment,
    })
}

// CancelBookingByID — ยกเลิกคิว (คืน used ให้ slot)
func CancelBookingByID(c *gin.Context) {
	id := c.Param("id")

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// lock booking
	var bk entity.Booking
	if err := tx.
		Clauses(clause.Locking{Strength: "UPDATE"}).
		First(&bk, "id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if bk.Status == "cancelled" {
		tx.Rollback()
		c.JSON(http.StatusOK, gin.H{"ok": true})
		return
	}

	// หา slot จาก key (date+segment+hhmm) แล้ว lock
	var slot entity.QueueSlot
	if err := tx.
		Clauses(clause.Locking{Strength: "UPDATE"}).
		First(&slot, "date = ? AND segment = ? AND hhmm = ?", bk.Date, bk.Segment, bk.HHMM).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "slot not found for booking"})
		return
	}

	// ลด used ของ slot (ไม่น้อยกว่า 0)
	if err := tx.Model(&entity.QueueSlot{}).
		Where("id = ? AND used > 0", slot.ID).
		UpdateColumn("used", gorm.Expr("used - 1")).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ตั้งสถานะ booking เป็น cancelled
	if err := tx.Model(&entity.Booking{}).
		Where("id = ?", bk.ID).
		Update("status", "cancelled").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
