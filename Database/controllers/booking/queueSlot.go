package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm/clause"

	"Database/configs"
	"Database/entity"
)


// ------------------- payload ใช้กับ admin upsert slots -------------------
type upsertSlotItem struct {
	HHMM     string `json:"hhmm"`     // "0900"
	Capacity int    `json:"capacity"` // 0 = ปิดรับ (ลบ)
}
type UpsertSlotsPayload struct {
	Date    string           `json:"date"`    // "YYYY-MM-DD"
	Segment string           `json:"segment"` // "morning" | "afternoon" | "evening"
	Slots   []upsertSlotItem `json:"slots"`
}

// POST — บันทึกตารางรับในวัน/ช่วง (สร้าง/แก้ไข/ลบ slot)
func CreateSlots(c *gin.Context) {
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
	d = normalizeUTCDate(d)

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// ทำรายการ HHMM ที่ต้อง "คงไว้"
	keep := make([]string, 0, len(p.Slots))
	for _, s := range p.Slots {
		keep = append(keep, s.HHMM)
	}

	// 1) ถ้าไม่ส่งอะไรมาเลย -> ลบทั้งช่วง
	if len(keep) == 0 {
		if err := tx.Where("date = ? AND segment = ?", d, p.Segment).
			Delete(&entity.QueueSlot{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		// 2) ส่งมาบางช่อง -> ลบเฉพาะที่ "ไม่ได้อยู่ใน keep"
		if err := tx.Where("date = ? AND segment = ? AND hhmm NOT IN ?", d, p.Segment, keep).
			Delete(&entity.QueueSlot{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// 3) Upsert ช่องที่ส่งมา (capacity > 0 = สร้าง/แก้, capacity <= 0 = ลบรายช่อง)
	for _, s := range p.Slots {
		if s.Capacity <= 0 {
			// เท่ากับสั่งปิดรายช่อง
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
		// ใช้ composite unique (date, hhmm, segment) ตาม entity.QueueSlot
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

type capacitySummary struct {
	Morning   int `json:"morning"`
	Afternoon int `json:"afternoon"`
	Evening   int `json:"evening"`
}

// GET //GetCapacitySummaryByDate
func GetCapacitySummaryByDate(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d)

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

// GET /api/queue/slots — สำหรับหน้า Manage Queue
func GetSlotsByDate(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d)

	var slots []entity.QueueSlot
	if err := configs.DB.
		Where("date = ?", d).
		Order("segment asc, hhmm asc").
		Find(&slots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": slots})
}

// GET  รายการ Booking ต่อวัน (ฝั่งแอดมิน)
func GetBookingsByDate(c *gin.Context) {
	ds := c.Query("date")
	d, err := time.Parse("2006-01-02", ds)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
		return
	}
	d = normalizeUTCDate(d)

	var rows []entity.Booking
	if err := configs.DB.
		Preload("Service").
		Where("date = ? AND status <> ?", d, "cancelled").
		Order("hhmm asc").
		Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// map เฉพาะฟิลด์ที่ต้องแสดง (เลี่ยงส่ง CreatedAt/UpdatedAt)
	out := make([]gin.H, 0, len(rows))
	for _, b := range rows {
		item := gin.H{
			"id":        b.ID,
			"firstName": b.FirstName,
			"lastName":  b.LastName,
			"phone":     b.PhoneNumber,
			"date":      b.Date.Format("2006-01-02"),
			"hhmm":      b.HHMM,
			"segment":   b.Segment,
		}
		if b.Service.ID != 0 {
			item["service"] = gin.H{"id": b.Service.ID, "name": b.Service.NameService}
		}
		out = append(out, item)
	}
	c.JSON(http.StatusOK, gin.H{"data": out})
}

// DELETE /api/queue/slots/:id
func DeleteQueueSlot(c *gin.Context) {
	id := c.Param("id")

	// กันลบช่องที่มีการใช้งานแล้ว
	var s entity.QueueSlot
	if err := configs.DB.First(&s, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "slot not found"})
		return
	}
	if s.Used > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "cannot delete slot with used > 0"})
		return
	}

	if err := configs.DB.Delete(&entity.QueueSlot{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

type UpdateSlotPayload struct {
	Date     *string `json:"date"`     // "YYYY-MM-DD"
	Segment  *string `json:"segment"`  // "morning"|"afternoon"|"evening"
	HHMM     *string `json:"hhmm"`     // "0900"
	Capacity *int    `json:"capacity"` // >0
}

func UpdateQueueSlot(c *gin.Context) {
	id := c.Param("id")
	var p UpdateSlotPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// lock แถวเดิม
	var slot entity.QueueSlot
	if err := tx.
		Clauses(clause.Locking{Strength: "UPDATE"}).
		First(&slot, "id = ?", id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "slot not found"})
		return
	}

	newDate := normalizeUTCDate(slot.Date)
	if p.Date != nil {
		d, err := time.Parse("2006-01-02", *p.Date)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "bad date"})
			return
		}
		newDate = normalizeUTCDate(d)
	}
	newSeg := slot.Segment
	if p.Segment != nil && *p.Segment != "" {
		newSeg = *p.Segment
	}
	newHH := slot.HHMM
	if p.HHMM != nil && *p.HHMM != "" {
		newHH = *p.HHMM
	}

	// จัดการ capacity
	if p.Capacity != nil {
		if *p.Capacity <= 0 {
			// ขอปิด slot นี้: อนุญาตเฉพาะเมื่อยังไม่มีคนจอง
			if slot.Used > 0 {
				tx.Rollback()
				c.JSON(http.StatusConflict, gin.H{"error": "cannot set capacity <= 0 while used > 0"})
				return
			}
			if err := tx.Delete(&entity.QueueSlot{}, "id = ?", slot.ID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if err := tx.Commit().Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"ok": true, "deleted": true})
			return
		}
		// ห้ามลดต่ำกว่า used
		if *p.Capacity < slot.Used {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{"error": "capacity cannot be less than used"})
			return
		}
	}

	// ถ้าเปลี่ยน key (date+segment+hhmm) ให้เช็คชน
	keyChanged := !(newDate.Equal(slot.Date) && newSeg == slot.Segment && newHH == slot.HHMM)
	if keyChanged {
		var cnt int64
		if err := tx.Model(&entity.QueueSlot{}).
			Where("date = ? AND segment = ? AND hhmm = ? AND id <> ?", newDate, newSeg, newHH, slot.ID).
			Count(&cnt).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if cnt > 0 {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{"error": "slot already exists at target (date+segment+hhmm)"})
			return
		}
	}

	// อัปเดตค่า
	slot.Date = newDate
	slot.Segment = newSeg
	slot.HHMM = newHH
	if p.Capacity != nil {
		slot.Capacity = *p.Capacity
	}

	if err := tx.Save(&slot).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":       slot.ID,
			"date":     slot.Date.Format("2006-01-02"),
			"segment":  slot.Segment,
			"hhmm":     slot.HHMM,
			"capacity": slot.Capacity,
			"used":     slot.Used,
		},
	})
}
