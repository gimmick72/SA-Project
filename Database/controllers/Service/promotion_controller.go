package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
	
)

// ดึง Promotion ทั้งหมด
func ListPromotions(c *gin.Context) {
	var promotions []entity.Promotion
	db := configs.DB
	
	if err := db.Preload("Service").Preload("Service.Category").Find(&promotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch promotions"})
		return
	}
	c.JSON(http.StatusOK, promotions)
}

// สร้าง Promotion ใหม่
func CreatePromotion(c *gin.Context) {
	var promotion entity.Promotion
	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validation
	if promotion.NamePromotion == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promotion name is required"})
		return
	}
	if promotion.Cost <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cost must be greater than 0"})
		return
	}
	if promotion.DateStart.After(promotion.DateEnd) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be after end date"})
		return
	}

	db := configs.DB
	if err := db.Create(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion"})
		return
	}

	// ดึงข้อมูล promotion พร้อม service กลับไป
	db.Preload("Service").Preload("Service.Category").First(&promotion, promotion.ID)
	c.JSON(http.StatusCreated, promotion)
}

// อัปเดต Promotion
func UpdatePromotion(c *gin.Context) {
	id := c.Param("id")
	var promotion entity.Promotion
	db := configs.DB

	if err := db.First(&promotion, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	var input entity.Promotion
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตเฉพาะฟิลด์ที่ส่งมา
	if input.NamePromotion != "" {
		promotion.NamePromotion = input.NamePromotion
	}
	if input.ServiceID > 0 {
		promotion.ServiceID = input.ServiceID
	}
	if input.PromotionDetail != "" {
		promotion.PromotionDetail = input.PromotionDetail
	}
	if input.Cost > 0 {
		promotion.Cost = input.Cost
	}
	if !input.DateStart.IsZero() {
		promotion.DateStart = input.DateStart
	}
	if !input.DateEnd.IsZero() {
		promotion.DateEnd = input.DateEnd
	}

	// ตรวจสอบ date validation
	if promotion.DateStart.After(promotion.DateEnd) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be after end date"})
		return
	}

	if err := db.Save(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update promotion"})
		return
	}

	// ดึงข้อมูล promotion พร้อม service กลับไป
	db.Preload("Service").Preload("Service.Category").First(&promotion, promotion.ID)
	c.JSON(http.StatusOK, promotion)
}

// ลบ Promotion
func DeletePromotion(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	var promotion entity.Promotion
	if err := db.First(&promotion, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	if err := db.Delete(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted successfully"})
}