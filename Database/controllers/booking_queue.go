package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"Database/configs"
	"Database/entity"
)

// --------- helper: normalize date เป็นเที่ยงคืน UTC เสมอ ----------
func normalizeUTCDate(d time.Time) time.Time {
	return time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
}

// ------------------- payload models --------------------------
type upsertSlotItem struct {
	HHMM     string `json:"hhmm"`     // "0900"
	Capacity int    `json:"capacity"` // 0 = ปิดรับ (ลบ)
}
type UpsertSlotsPayload struct {
	Date    string           `json:"date"`    // "YYYY-MM-DD"
	Segment string           `json:"segment"` // "morning"|"afternoon"|"evening"
	Slots   []upsertSlotItem `json:"slots"`
}

// ------------------- /api/queue/slots (admin) ----------------
// POST — บันทึกตารางรับในวัน/ช่วง
func UpsertSlots(c *gin.Context) {
	var p UpsertSlotsPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}
	d, err := time.Parse("2006-01-02", p.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d) // ✅ ใช้ UTC midnight เสมอ

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// ถ้าไม่ติ๊กอะไรเลย -> ลบทั้งช่วงของวันนั้น
	keep := make([]string, 0, len(p.Slots))
	for _, s := range p.Slots {
		keep = append(keep, s.HHMM)
	}
	if len(keep) == 0 {
		if err := tx.Where("date = ? AND segment = ?", d, p.Segment).
			Delete(&entity.QueueSlot{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		// ติ๊กบางช่อง -> ลบเฉพาะที่ไม่อยู่ใน keep
		if err := tx.Where("date = ? AND segment = ? AND hhmm NOT IN ?", d, p.Segment, keep).
			Delete(&entity.QueueSlot{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// upsert ช่องที่ส่งมา (เฉพาะ capacity > 0)
	for _, s := range p.Slots {
		if s.Capacity <= 0 {
			// ตั้ง 0 มาก็ลบรายช่อง
			if err := tx.Where("date = ? AND segment = ? AND hhmm = ?", d, p.Segment, s.HHMM).
				Delete(&entity.QueueSlot{}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			continue
		}
		slot := entity.QueueSlot{
			Date: d, HHMM: s.HHMM, Segment: p.Segment, Capacity: s.Capacity,
		}
		if err := tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "date"}, {Name: "hhmm"}, {Name: "segment"}},
			DoUpdates: clause.Assignments(map[string]interface{}{"capacity": s.Capacity}),
		}).Create(&slot).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ------------------- /api/queue/capacity ---------------------
type capacitySummary struct {
	Morning   int `json:"morning"`
	Afternoon int `json:"afternoon"`
	Evening   int `json:"evening"`
}

// GET ?date=YYYY-MM-DD — รวม “ที่ว่าง” ต่อช่วง (SUM(capacity-used))
func GetCapacitySummary(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d) // ✅

	type agg struct {
		Segment string
		Free    int
	}
	var rows []agg
	if err := configs.DB.
		Model(&entity.QueueSlot{}).
		Select("segment, SUM(capacity - used) as free").
		Where("date = ?", d).
		Group("segment").
		Scan(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	out := capacitySummary{}
	for _, r := range rows {
		switch r.Segment {
		case "morning":
			out.Morning = r.Free
		case "afternoon":
			out.Afternoon = r.Free
		case "evening":
			out.Evening = r.Free
		}
	}
	c.JSON(http.StatusOK, out)
}

// ------------------- /api/bookings ---------------------------
type CreateBookingPayload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Phone     string `json:"phone"`
	ServiceID uint   `json:"serviceId"`
	Date      string `json:"date"`     // YYYY-MM-DD
	TimeSlot  string `json:"timeSlot"` // "morning"|"afternoon"|"evening"
}

// POST — จองคิว (เลือกช่วง) แล้วจัดสรรช่องเวลาให้
func CreateBooking(c *gin.Context) {
	var p CreateBookingPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}
	d, err := time.Parse("2006-01-02", p.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d) // ✅

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// หา "ช่องแรก" ที่ยังเหลือ (order ตามเวลา)
	var slot entity.QueueSlot
	if err := tx.
		Where("date = ? AND segment = ? AND used < capacity", d, p.TimeSlot).
		Order("hhmm asc").
		First(&slot).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{"error": "no capacity"})
			return
		}
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัปเดต used แบบป้องกันชน (optimistic)
	res := tx.Model(&entity.QueueSlot{}).
		Where("id = ? AND used < capacity", slot.ID).
		Update("used", gorm.Expr("used + 1"))
	if res.Error != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": res.Error.Error()})
		return
	}
	if res.RowsAffected != 1 {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{"error": "just filled, try again"})
		return
	}

	bk := entity.Booking{
		FirstName: p.FirstName, LastName: p.LastName, Phone: p.Phone,
		ServiceID: &p.ServiceID, Date: d, HHMM: slot.HHMM, Segment: slot.Segment,
		SlotID: slot.ID, Status: "reserved",
	}
	if err := tx.Create(&bk).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"id": bk.ID, "date": p.Date, "hhmm": slot.HHMM, "segment": slot.Segment,
	})
}

// POST /api/bookings/:id/cancel — ยกเลิกคิว (คืน used)
func CancelBooking(c *gin.Context) {
	id := c.Param("id")

	tx := configs.DB.Begin()

	var bk entity.Booking
	if err := tx.First(&bk, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	if bk.Status == "cancelled" {
		tx.Rollback()
		c.JSON(http.StatusOK, gin.H{"ok": true})
		return
	}

	// ลด used ของช่องนั้น (ไม่น้อยกว่า 0)
	if err := tx.Model(&entity.QueueSlot{}).
		Where("id = ? AND used > 0", bk.SlotID).
		Update("used", gorm.Expr("used - 1")).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

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

// ------------------- read-only for admin views ----------------
// GET /api/queue/slots?date=YYYY-MM-DD — ใช้แสดงใน ManageQueue (ดู/แก้)
func ListSlots(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d) // ✅

	var slots []entity.QueueSlot
	if err := configs.DB.Where("date = ?", d).Order("segment asc, hhmm asc").Find(&slots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": slots})
}

// GET /api/bookings?date=YYYY-MM-DD — รายชื่อต่อช่องเวลา (แสดงใน View Modal)
func ListBookingsByDate(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d) // ✅

	var rows []entity.Booking
	if err := configs.DB.
		Where("date = ? AND status <> ?", d, "cancelled").
		Order("hhmm asc").
		Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": rows})
}

