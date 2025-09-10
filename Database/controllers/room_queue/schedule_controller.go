// room queue
package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Database/configs"
	"Database/entity"
)

// ---------- helpers ----------
const dayFmt = "2006-01-02"

func dayBoundsUTC(d time.Time) (time.Time, time.Time) {
	start := time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
	return start, start.AddDate(0, 0, 1)
}

func daySlots() []string {
	s := make([]string, 0, 11)
	for h := 10; h <= 20; h++ { s = append(s, fmt.Sprintf("%02d:00", h)) }
	return s
}

func listRooms() []struct{ ID, Name string } {
	return []struct{ ID, Name string }{
		{"1", "ห้องตรวจ 1"}, {"2", "ห้องตรวจ 2"},
		{"3", "ห้องตรวจ 3"}, {"4", "ห้องตรวจ 4"},
	}
}

// ---------- response shapes ที่ frontend ใช้ ----------
type timeSlotResp struct {
	Time    string      `json:"time"`
	Patient interface{} `json:"patient"` // nil หรือ { id,name,type,caseCode,note,durationMin }
}
type roomResp struct {
	RoomID         string        `json:"roomId"`
	RoomName       string        `json:"roomName"`
	AssignedDoctor *string       `json:"assignedDoctor"`
	TimeSlots      []timeSlotResp`json:"timeSlots"`
}

// ---------- GET /api/schedule?mode=day&date=YYYY-MM-DD ----------
func GetSchedule(c *gin.Context) {
	dateStr := c.Query("date")
	if dateStr == "" { c.JSON(http.StatusBadRequest, gin.H{"error":"date is required"}); return }
	d, err := time.Parse(dayFmt, dateStr)
	if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid date"}); return }
	start, end := dayBoundsUTC(d)

	var appts []entity.Appointment
	if err := configs.DB.Where("date >= ? AND date < ?", start, end).Find(&appts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
	}

	type key struct{ RoomID, Time string }
	idx := map[key]entity.Appointment{}
	for _, a := range appts { idx[key{a.RoomID, a.Time}] = a }

	slots := daySlots()
	rooms := listRooms()
	resp := make([]roomResp, 0, len(rooms))
	for _, r := range rooms {
		ts := make([]timeSlotResp, 0, len(slots))
		for _, t := range slots {
			if a, ok := idx[key{r.ID, t}]; ok {
				p := map[string]interface{}{
					"id": a.PatientID, "name": a.PatientName, "type": a.Type,
				}
				if a.CaseCode != nil { p["caseCode"] = *a.CaseCode }
				if a.Note != nil { p["note"] = *a.Note }
				if a.DurationMin != nil { p["durationMin"] = *a.DurationMin }
				ts = append(ts, timeSlotResp{Time: t, Patient: p})
			} else {
				ts = append(ts, timeSlotResp{Time: t, Patient: nil})
			}
		}
		resp = append(resp, roomResp{RoomID: r.ID, RoomName: r.Name, AssignedDoctor: nil, TimeSlots: ts})
	}
	c.JSON(http.StatusOK, resp)
}

// ---------- POST /api/schedule/assign ----------
type AssignReq struct {
	Date       string  `json:"date"       binding:"required"` // YYYY-MM-DD
	RoomID     string  `json:"roomId"     binding:"required"`
	Time       string  `json:"time"       binding:"required"` // "HH:MM"
	PatientID  *string `json:"patientId"`                    // nil = ลบออก
	FromRoomID *string `json:"fromRoomId"`
	FromTime   *string `json:"fromTime"`

	PatientName *string `json:"patientName"`
	Type        *string `json:"type"` // "appointment" | "walkin"
	CaseCode    *string `json:"caseCode"`
	Note        *string `json:"note"`
	DurationMin *int    `json:"durationMin"`
}

func AssignSchedule(c *gin.Context) {
	var req AssignReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()}); return
	}
	day, err := time.Parse(dayFmt, req.Date)
	if err != nil { c.JSON(http.StatusBadRequest, gin.H{"error":"invalid date"}); return }
	start, end := dayBoundsUTC(day)

	tx := configs.DB.Begin()
	defer func(){ if r := recover(); r != nil { tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error":"panic"}) } }()

	// ลบ
	if req.PatientID == nil {
		if err := tx.Where("date >= ? AND date < ? AND room_id = ? AND time = ?", start, end, req.RoomID, req.Time).
			Delete(&entity.Appointment{}).Error; err != nil {
			tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
		}
		_ = tx.Commit(); c.JSON(http.StatusOK, gin.H{"ok": true}); return
	}

	incomingType := "walkin"
	if req.Type != nil && (*req.Type == "appointment" || *req.Type == "walkin") {
		incomingType = *req.Type
	}

	// ปลายทาง
	var dest entity.Appointment
	res := tx.Where("date >= ? AND date < ? AND room_id = ? AND time = ?", start, end, req.RoomID, req.Time).
		First(&dest)
	if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
		tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": res.Error.Error()}); return
	}
	destOccupied := res.RowsAffected > 0

	if destOccupied {
		// drag ลงที่เดิม (no-op)
		if req.FromRoomID != nil && req.FromTime != nil &&
			*req.FromRoomID == req.RoomID && *req.FromTime == req.Time &&
			dest.PatientID == *req.PatientID {
			// pass
		} else if dest.Type == "appointment" && incomingType == "appointment" {
			tx.Rollback(); c.JSON(http.StatusConflict, gin.H{"error":"ช่องนี้มีนัดอยู่แล้ว"}); return
		} else if incomingType == "appointment" && dest.Type == "walkin" {
			next, ok := findNextFree(tx, start, end, req.RoomID, req.Time)
			if !ok {
				tx.Rollback(); c.JSON(http.StatusConflict, gin.H{"error":"ไม่มีช่องว่างถัดไปสำหรับเลื่อน walk-in"}); return
			}
			if err := tx.Model(&entity.Appointment{}).Where("id = ?", dest.ID).Update("time", next).Error; err != nil {
				tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
			}
		} else {
			tx.Rollback(); c.JSON(http.StatusConflict, gin.H{"error":"ช่องนี้ไม่ว่าง"}); return
		}
	}

	// เคลียร์ต้นทาง (ถ้ามี)
	if req.FromRoomID != nil && req.FromTime != nil {
		_ = tx.Where("date >= ? AND date < ? AND room_id = ? AND time = ? AND patient_id = ?",
			start, end, *req.FromRoomID, *req.FromTime, *req.PatientID).
			Delete(&entity.Appointment{}).Error
	}

	// มีนัดของคนนี้ในวันนี้อยู่แล้วหรือยัง
	var same entity.Appointment
	res = tx.Where("date >= ? AND date < ? AND patient_id = ?", start, end, *req.PatientID).First(&same)
	if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
		tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": res.Error.Error()}); return
	}
	if res.RowsAffected > 0 {
		// ย้ายที่
		if err := tx.Model(&entity.Appointment{}).Where("id = ?", same.ID).
			Updates(map[string]interface{}{
				"room_id": req.RoomID, "time": req.Time, "type": incomingType,
				"patient_name": func() string { if req.PatientName != nil { return *req.PatientName }; return same.PatientName }(),
				"case_code": req.CaseCode, "note": req.Note, "duration_min": req.DurationMin,
			}).Error; err != nil {
			tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
		}
	} else {
		// สร้างใหม่
		a := entity.Appointment{
			Date:        start, // เที่ยงคืน UTC ของวันนั้น
			RoomID:      req.RoomID,
			Time:        req.Time,
			PatientID:   *req.PatientID,
			PatientName: func() string { if req.PatientName != nil { return *req.PatientName }; return "" }(),
			Type:        incomingType,
			CaseCode:    req.CaseCode,
			Note:        req.Note,
			DurationMin: req.DurationMin,
		}
		if err := tx.Create(&a).Error; err != nil {
			tx.Rollback(); c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func findNextFree(tx *gorm.DB, start, end time.Time, roomID, current string) (string, bool) {
	slots := daySlots()
	var rows []entity.Appointment
	if err := tx.Where("date >= ? AND date < ? AND room_id = ?", start, end, roomID).
		Find(&rows).Error; err != nil {
		return "", false
	}
	occ := map[string]bool{}
	for _, r := range rows { occ[r.Time] = true }

	found := false
	for _, s := range slots {
		if s == current { found = true; continue }
		if found && !occ[s] { return s, true }
	}
	return "", false
}
