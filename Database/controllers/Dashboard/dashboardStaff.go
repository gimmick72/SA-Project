package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	
	"Database/entity"
)

// Controller struct ที่จะรับ db เข้ามา
type InitialSymptompsController struct {
	DB *gorm.DB
}

// NewInitialSymptompsController สร้าง instance ของ controller
func NewInitialSymptompsController(db *gorm.DB) *InitialSymptompsController {
	return &InitialSymptompsController{DB: db}
}

// GetTodayInitialSymptomps ดึงข้อมูลตามวันที่ปัจจุบัน
func (c *InitialSymptompsController) GetTodayInitialSymptomps(ctx *gin.Context) {
	// วันที่ปัจจุบัน (เทียบแบบไม่เอาเวลา)
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)

	var symptomps []entity.InitialSymptomps

	// Query ข้อมูลที่ Visit อยู่ระหว่าง [today, tomorrow) with optional preloads
	query := c.DB.Preload("Patient")
	
	// Only preload Service and Status if they exist
	if c.DB.Migrator().HasTable(&entity.Service{}) {
		query = query.Preload("Service")
	}
	if c.DB.Migrator().HasTable(&entity.Status{}) {
		query = query.Preload("Status")
	}

	if err := query.Where("visit >= ? AND visit < ?", today, tomorrow).
		Find(&symptomps).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"date":      today.Format("2006-01-02"),
		"symptomps": symptomps,
	})
}
