package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"Database/configs"
	"Database/entity"
)

type QueuePatientResp struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"` // "appointment" | "walkin"
	CaseCode    *string `json:"caseCode,omitempty"`
	DurationMin *int    `json:"durationMin,omitempty"`
}

const qDayFmt = "2006-01-02"

func qDayBoundsUTC(d time.Time) (time.Time, time.Time) {
	start := time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
	return start, start.AddDate(0, 0, 1)
}

// GET /api/queue/patients?date=YYYY-MM-DD
// ดึง Booking ของวันนั้น (เช่น status=confirmed) เพื่อแสดง “คิวฝั่งซ้าย” ให้ลากวาง
func GetQueuePatients(c *gin.Context) {
	dateStr := c.Query("date")

	var d time.Time
	var err error
	if dateStr == "" {
		now := time.Now()
		d = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	} else {
		d, err = time.Parse(qDayFmt, dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
			return
		}
	}

	start, end := qDayBoundsUTC(d)

	var rows []entity.Booking
	if err := configs.DB.
		Where("date >= ? AND date < ? AND status = ?", start, end, "confirmed").
		Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defDur := 60
	out := make([]QueuePatientResp, 0, len(rows))
	for _, b := range rows {
		name := strings.TrimSpace(b.FirstName + " " + b.LastName)
		code := fmt.Sprintf("BK-%d", b.ID)

		out = append(out, QueuePatientResp{
			ID:          fmt.Sprintf("BK-%d", b.ID), // string ตามสเปคหน้า UI
			Name:        name,
			Type:        "appointment",
			CaseCode:    &code,
			DurationMin: &defDur,
		})
	}

	c.JSON(http.StatusOK, out)
}
