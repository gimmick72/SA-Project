package controllers
import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"Database/configs"
)

func normalizeUTCDate(d time.Time) time.Time {
	return time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
}

type BookingResult struct {
	ID          uint      `json:"id"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	PhoneNumber string    `json:"phone_number"`
	Date        time.Time `json:"date"`         // ใช้ time.Time กัน scan error
	HHMM        string    `json:"hhmm"`
	Segment     string    `json:"segment"`
	Status      string    `json:"status"`
	ServiceID   uint      `json:"service_id"`
	ServiceName string    `json:"service_name"` // อาจเป็น "" ถ้าไม่มีตาราง services
}

// GET /api/bookings/search-by-phone?phone=080...&date=YYYY-MM-DD
func SearchBookingsByPhone(c *gin.Context) {
	db := configs.DB
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database is not initialized"})
		return
	}

	phone := strings.TrimSpace(c.Query("phone"))
	if phone == "" {
		phone = strings.TrimSpace(c.Query("phone_number"))
	}
	if phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "phone parameter is required"})
		return
	}

	// keep digits only
	clean := strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' { return r }
		return -1
	}, phone)
	if len(clean) < 9 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "phone number must contain at least 9 digits"})
		return
	}

	// optional date filter: [00:00, nextDay)
	var start, end time.Time
	useDate := false
	if ds := strings.TrimSpace(c.Query("date")); ds != "" {
		d, err := time.Parse("2006-01-02", ds)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
			return
		}
		start = normalizeUTCDate(d)
		end = start.Add(24 * time.Hour)
		useDate = true
	}

	// ------- Query หลัก (มี service_name ด้วย subquery) -------
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
		`).
		Where("REPLACE(REPLACE(REPLACE(b.phone_number, '-', ''), ' ', ''), '+66', '0') LIKE ?", "%"+clean+"%")

	if useDate {
		q = q.Where("b.date >= ? AND b.date < ?", start, end)
	}

	var out []BookingResult
	err := q.Order("b.date DESC, b.hhmm ASC").Scan(&out).Error
	if err != nil {
		// ------- Fallback: ถ้าตาราง services ไม่มี ให้ดึงโดยไม่อ้างอิงเลย -------
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
			`).
			Where("REPLACE(REPLACE(REPLACE(b.phone_number, '-', ''), ' ', ''), '+66', '0') LIKE ?", "%"+clean+"%")
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

	c.JSON(http.StatusOK, gin.H{"data": out, "count": len(out)})
}
