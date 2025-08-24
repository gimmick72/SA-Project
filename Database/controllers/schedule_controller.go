package controllers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)

// --------- Response shape ให้ตรงกับ UI ---------
type timeSlotResp struct {
	Time    string      `json:"time"`
	Patient interface{} `json:"patient"` // nil หรือ object { id,name,type,caseCode,note,durationMin }
}

type roomResp struct {
	RoomID         string        `json:"roomId"`
	RoomName       string        `json:"roomName"`
	AssignedDoctor *string       `json:"assignedDoctor"`
	TimeSlots      []timeSlotResp`json:"timeSlots"`
}

// ช่องเวลาประจำวัน (10:00 - 20:00 ทุก 60 นาที)
func daySlots() []string {
	slots := make([]string, 0, 11)
	for h := 10; h <= 20; h++ {
		slots = append(slots, time.Date(0,1,1,h,0,0,0,time.Local).Format("15:04"))
	}
	return slots
}

// ถ้าคุณมีตาราง rooms อยู่แล้ว เปลี่ยนให้ดึงจาก DB ได้
func listRooms() []struct{ ID, Name string } {
	return []struct{ ID, Name string }{
		{"1", "ห้องตรวจ 1"},
		{"2", "ห้องตรวจ 2"},
		{"3", "ห้องตรวจ 3"},
		{"4", "ห้องตรวจ 4"},
	}
}

// --------- GET /api/schedule?mode=day&date=YYYY-MM-DD (หรือ week&start=&end=) ---------
func GetSchedule(c *gin.Context) {
	mode := strings.ToLower(c.DefaultQuery("mode", "day"))
	dateStr := c.Query("date")
	startStr := c.Query("start")
	endStr := c.Query("end")

	// ปัจจุบันรองรับ day เป็นหลัก (week จะรวมค่า day หลายวัน)
	var dates []time.Time
	const dfmt = "2006-01-02"

	if mode == "week" && startStr != "" && endStr != "" {
		start, err1 := time.Parse(dfmt, startStr)
		end, err2 := time.Parse(dfmt, endStr)
		if err1 != nil || err2 != nil || end.Before(start) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid week range"})
			return
		}
		for d := start; !d.After(end); d = d.AddDate(0,0,1) {
			dates = append(dates, d)
		}
	} else {
		if dateStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "date is required"})
			return
		}
		d, err := time.Parse(dfmt, dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
			return
		}
		dates = []time.Time{d}
	}

	rooms := listRooms()
	slots := daySlots()

	// สร้าง map สำหรับสอบถาม appointments ของวันทั้งหมดในช่วง (กรณี week)
	var allResp []roomResp
	// ตอนนี้ UI แสดงหน้าวันเดียว; ถ้าจะทำสัปดาห์ อาจต้องแยก response เป็นหลายวัน
	// ที่นี่จะตอบกลับเฉพาะ "วันแรก" ของช่วง เพื่อให้ UI เดิมทำงานก่อน
	targetDate := dates[0]

	var appts []entity.Appointment
	if err := configs.DB.
		Where("date = date(?)", targetDate.Format(dfmt)).
		Find(&appts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// index appointment ตาม room+time
	type key struct{ RoomID, Time string }
	apIndex := map[key]entity.Appointment{}
	for _, a := range appts {
		apIndex[key{a.RoomID, a.Time}] = a
	}

	for _, r := range rooms {
		var ts []timeSlotResp
		for _, t := range slots {
			if a, ok := apIndex[key{r.ID, t}]; ok {
				// คืน patient ตาม shape UI
				p := map[string]interface{}{
					"id":          a.PatientID,
					"name":        a.PatientName,
					"type":        a.Type,
				}
				if a.CaseCode != nil { p["caseCode"] = *a.CaseCode }
				if a.Note != nil     { p["note"] = *a.Note }
				if a.DurationMin != nil { p["durationMin"] = *a.DurationMin }
				ts = append(ts, timeSlotResp{Time: t, Patient: p})
			} else {
				ts = append(ts, timeSlotResp{Time: t, Patient: nil})
			}
		}
		allResp = append(allResp, roomResp{
			RoomID:         r.ID,
			RoomName:       r.Name,
			AssignedDoctor: nil, // ภายหลังค่อยผูกจริง
			TimeSlots:      ts,
		})
	}

	c.JSON(http.StatusOK, allResp)
}

// --------- POST /api/schedule/assign ---------
type AssignReq struct {
	Date       string  `json:"date"       binding:"required"` // YYYY-MM-DD
	RoomID     string  `json:"roomId"     binding:"required"`
	Time       string  `json:"time"       binding:"required"` // "HH:mm"
	PatientID  *string `json:"patientId"`                    // nil = ลบออก
	FromRoomID *string `json:"fromRoomId,omitempty"`
	FromTime   *string `json:"fromTime,omitempty"`

	// ข้อมูลเสริม (ถ้ามี ส่งมาก็เก็บ)
	PatientName *string `json:"patientName,omitempty"`
	Type        *string `json:"type,omitempty"` // "appointment" | "walkin"
	CaseCode    *string `json:"caseCode,omitempty"`
	Note        *string `json:"note,omitempty"`
	DurationMin *int    `json:"durationMin,omitempty"`
}

func AssignSchedule(c *gin.Context) {
	var req AssignReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	const dfmt = "2006-01-02"
	day, err := time.Parse(dfmt, req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
		return
	}

	// rule ที่ UI ใช้:
	// - appointment ทับ appointment -> ไม่อนุญาต
	// - appointment ทับ walk-in -> เลื่อน walk-in ไปช่องว่างถัดไป
	// - move: ถ้ามี fromRoom/fromTime ให้เคลียร์ช่องเดิม

	slots := daySlots()

	findNextFree := func(start string) (string, bool) {
		// หาช่องว่างถัดไปในวันเดียวกัน
		// ดึงรายการที่มีอยู่มาไว้ก่อน
		var rows []entity.Appointment
		if err := configs.DB.Where("date = date(?) AND room_id = ?", req.Date, req.RoomID).Find(&rows).Error; err != nil {
			return "", false
		}
		occupied := map[string]bool{}
		for _, r := range rows {
			occupied[r.Time] = true
		}
		// หาถัดจาก start
		foundStart := false
		for _, s := range slots {
			if s == start {
				foundStart = true
				continue
			}
			if foundStart && !occupied[s] {
				return s, true
			}
		}
		return "", false
	}

	tx := configs.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "panic"})
		}
	}()

	// 1) ถ้าเป็นการลบ: ลบช่องเป้าหมาย
	if req.PatientID == nil {
		if err := tx.Where("date = date(?) AND room_id = ? AND time = ?", req.Date, req.RoomID, req.Time).
			Delete(&entity.Appointment{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		tx.Commit()
		c.JSON(http.StatusOK, gin.H{"ok": true})
		return
	}

	// 2) มีผู้ป่วยที่จะใส่
	incomingType := "walkin"
	if req.Type != nil && (*req.Type == "appointment" || *req.Type == "walkin") {
		incomingType = *req.Type
	}

	// ตรวจดูว่าช่องปลายทางมีใครอยู่ไหม
	var dest entity.Appointment
	err = tx.Where("date = date(?) AND room_id = ? AND time = ?", req.Date, req.RoomID, req.Time).
		First(&dest).Error

	destOccupied := (err == nil) // พบข้อมูลอยู่แล้ว

	if destOccupied {
		// มีคนอยู่
		if dest.Type == "appointment" && incomingType == "appointment" {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{"error": "ช่องนี้มีนัดอยู่แล้ว"})
			return
		}
		if incomingType == "appointment" && dest.Type == "walkin" {
			// เลื่อน walk-in ไปช่องว่างถัดไป
			next, ok := findNextFree(req.Time)
			if !ok {
				tx.Rollback()
				c.JSON(http.StatusConflict, gin.H{"error": "ไม่มีช่องว่างถัดไปสำหรับเลื่อน walk-in"})
				return
			}
			// ย้ายแถวเดิมของ walk-in ไป next
			if err := tx.Model(&entity.Appointment{}).
				Where("id = ?", dest.ID).
				Update("time", next).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	// 3) ถ้ามี fromRoom/fromTime -> ลบ/เคลียร์ช่องเดิม (กรณีเป็นการย้าย)
	if req.FromRoomID != nil && req.FromTime != nil {
		if err := tx.Where("date = date(?) AND room_id = ? AND time = ? AND patient_id = ?",
			req.Date, *req.FromRoomID, *req.FromTime, *req.PatientID).
			Delete(&entity.Appointment{}).Error; err != nil {
			// ถ้าไม่เจอ ก็ข้ามไป (อาจเป็นการ “เพิ่มใหม่”)
		}
	}

	// 4) ใส่/อัปเดตที่ปลายทาง
	// ถ้าเดสทิเนชันว่าง -> Create ใหม่, ถ้าเคยมี (และเปลี่ยนชนิด) -> Update ค่า
	// ลองหาว่าคนนี้ในวันนี้เคยอยู่ที่อื่นไหม (กันกรณี duplicate)
	var samePatient entity.Appointment
	err = tx.Where("date = date(?) AND patient_id = ?", req.Date, *req.PatientID).
		First(&samePatient).Error
	if err == nil && (samePatient.RoomID != req.RoomID || samePatient.Time != req.Time) {
		// ย้ายแถวเดิมของคนเดิมไปปลายทาง
		if err := tx.Model(&entity.Appointment{}).Where("id = ?", samePatient.ID).
			Updates(map[string]interface{}{
				"room_id":     req.RoomID,
				"time":        req.Time,
				"type":        incomingType,
				"patient_name": func() string {
					if req.PatientName != nil { return *req.PatientName }
					return samePatient.PatientName
				}(),
				"case_code":   req.CaseCode,
				"note":        req.Note,
				"duration_min": req.DurationMin,
			}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		// สร้างใหม่ที่ปลายทาง
		a := entity.Appointment{
			Date:        day,
			RoomID:      req.RoomID,
			Time:        req.Time,
			PatientID:   *req.PatientID,
			PatientName: func() string { if req.PatientName!=nil { return *req.PatientName }; return "" }(),
			Type:        incomingType,
			CaseCode:    req.CaseCode,
			Note:        req.Note,
			DurationMin: req.DurationMin,
		}
		if err := tx.Create(&a).Error; err != nil {
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
