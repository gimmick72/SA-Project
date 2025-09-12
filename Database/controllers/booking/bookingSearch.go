package controllers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"Database/configs"
)

// ให้วันที่เป็นเที่ยงคืน UTC เสมอ (ตัดเวลาออก)
func normalizeUTCDate(d time.Time) time.Time {
	return time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
}

type BookingResult struct {
	ID          uint      `json:"id"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	PhoneNumber string    `json:"phone_number"`
	Date        time.Time `json:"date"`
	HHMM        string    `json:"hhmm"`
	Segment     string    `json:"segment"`
	Status      string    `json:"status"`
	ServiceID   uint      `json:"service_id"`
	ServiceName string    `json:"service_name"`
}

// GET /api/bookings/search?phone=080xxxxxxx&date=2025-09-12
// - ใส่ phone อย่างเดียวได้
// - ใส่ date อย่างเดียวได้
// - หรือใส่ทั้งคู่ก็ได้ (จะ AND เงื่อนไข)
func SearchBookings(c *gin.Context) {
	db := configs.DB
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database is not initialized"})
		return
	}

	// -------- อ่าน query params --------
	phone := strings.TrimSpace(c.Query("phone"))
	if phone == "" {
		phone = strings.TrimSpace(c.Query("phone_number")) // รองรับชื่อ param เดิม
	}
	dateStr := strings.TrimSpace(c.Query("date")) // รูปแบบ YYYY-MM-DD

	// ต้องมีอย่างน้อย 1 เงื่อนไข
	if phone == "" && dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "at least one of 'phone' or 'date' is required",
		})
		return
	}

	// เตรียมตัวกรองเบอร์ (เก็บเฉพาะตัวเลข)
	var phoneClean string
	if phone != "" {
		phoneClean = strings.Map(func(r rune) rune {
			if r >= '0' && r <= '9' {
				return r
			}
			return -1
		}, phone)

		// แปลงรูปแบบเบอร์แบบไทย +66xxxxxxxxx -> 0xxxxxxxxx ในฝั่ง SQL ด้วย
		// แต่ในฝั่ง input ถ้า user ใส่มาเป็น +66… เราก็ clean จนเหลือตัวเลขเหมือนกัน
		if len(phoneClean) < 9 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "phone number must contain at least 9 digits"})
			return
		}
	}

	// เตรียมตัวกรองวันที่ (ช่วง [00:00, 24:00) ของวันนั้น)
	useDate := false
	var start, end time.Time
	if dateStr != "" {
		d, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
			return
		}
		start = normalizeUTCDate(d)
		end = start.Add(24 * time.Hour)
		useDate = true
	}

	// -------- Query หลัก (พร้อม service_name) --------
	// หมายเหตุ: ใช้ REPLACE เพื่อลบ '-', ' ', และเปลี่ยน +66 เป็น 0 ก่อนเทียบ
	q := db.Table("bookings AS b").
		Select(`
			b.id,
			b.first_name,
			b.last_name,
			b.phone_number,
			b.date,
			b.hhmm,
			b.segment,
			b.status,
			b.service_id,
			COALESCE((SELECT name FROM services WHERE id = b.service_id), '') AS service_name
		`)

	// เงื่อนไขเบอร์ (optional)
	if phoneClean != "" {
		q = q.Where(`
			REPLACE(
				REPLACE(
					REPLACE(b.phone_number, '-', ''),
				' ', ''),
			'+66', '0') LIKE ?`, "%"+phoneClean+"%")
	}

	// เงื่อนไขวันที่ (optional)
	if useDate {
		q = q.Where("b.date >= ? AND b.date < ?", start, end)
	}

	var out []BookingResult
	if err := q.Order("b.date DESC, b.hhmm ASC").Scan(&out).Error; err != nil {
		// ถ้าดึง service_name ไม่ได้ (เช่นไม่มีตาราง services) ให้ fallback
		q2 := db.Table("bookings AS b").
			Select(`
				b.id,
				b.first_name,
				b.last_name,
				b.phone_number,
				b.date,
				b.hhmm,
				b.segment,
				b.status,
				b.service_id,
				'' AS service_name
			`)

		if phoneClean != "" {
			q2 = q2.Where(`
				REPLACE(
					REPLACE(
						REPLACE(b.phone_number, '-', ''),
					' ', ''),
				'+66', '0') LIKE ?`, "%"+phoneClean+"%")
		}
		if useDate {
			q2 = q2.Where("b.date >= ? AND b.date < ?", start, end)
		}

		if err2 := q2.Order("b.date DESC, b.hhmm ASC").Scan(&out).Error; err2 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "failed to search bookings",
				"details": err2.Error(),
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  out,
		"count": len(out),
	})
}
