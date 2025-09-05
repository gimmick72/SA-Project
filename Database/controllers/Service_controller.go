package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)


// ดึงข้อมูล Service ทั้งหมด
func ListServices(c *gin.Context) {
	var services []entity.Service
	db := configs.DB
	if err := db.Preload("Category").Find(&services).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch services"})
		return
	}
	c.JSON(http.StatusOK, services)
}

// สร้าง Service ใหม่
func CreateService(c *gin.Context) {
	var service entity.Service
	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := configs.DB
	if err := db.Create(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create service"})
		return
	}

	c.JSON(http.StatusOK, service)
}

// อัปเดต Service
func UpdateService(c *gin.Context) {
	id := c.Param("id")
	var service entity.Service
	db := configs.DB

	if err := db.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}

	var input entity.Service
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service.NameService = input.NameService
	service.DetailService = input.DetailService
	service.Cost = input.Cost
	service.CategoryID = input.CategoryID

	if err := db.Save(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update service"})
		return
	}

	c.JSON(http.StatusOK, service)
}

// ลบ Service
func DeleteService(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	if err := db.Delete(&entity.Service{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete service"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Service deleted"})
}

// -------------------- Category --------------------

// ดึง Category ทั้งหมด
func ListCategories(c *gin.Context) {
	var categories []entity.Category
	db := configs.DB
	if err := db.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// สร้าง Category ใหม่
func CreateCategory(c *gin.Context) {
	var category entity.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := configs.DB
	if err := db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// -------------------- Promotion --------------------

// ดึง Promotion ทั้งหมด
func ListPromotions(c *gin.Context) {
	var promotions []entity.Promotion
	db := configs.DB
	if err := db.Preload("Service").Find(&promotions).Error; err != nil {
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

	// ตรวจสอบวันเริ่มและวันสิ้นสุด
	if promotion.DateStart.After(promotion.DateEnd) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DateStart cannot be after DateEnd"})
		return
	}

	db := configs.DB
	if err := db.Create(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion"})
		return
	}

	c.JSON(http.StatusOK, promotion)
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

	promotion.NamePromotion = input.NamePromotion
	promotion.ServiceID = input.ServiceID
	promotion.PromotionDetail = input.PromotionDetail
	promotion.Cost = input.Cost
	promotion.DateStart = input.DateStart
	promotion.DateEnd = input.DateEnd

	if err := db.Save(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update promotion"})
		return
	}

	c.JSON(http.StatusOK, promotion)
}

// ลบ Promotion
func DeletePromotion(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	if err := db.Delete(&entity.Promotion{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted"})
}
