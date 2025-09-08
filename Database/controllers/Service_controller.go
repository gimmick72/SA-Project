// controllers/service_controller.go
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)

type Service struct {
    ID            uint    `json:"id"`
    NameService   string  `json:"name_service"`
    DetailService string  `json:"detail_service"`
    Cost          float32 `json:"cost"`
    CategoryID    int     `json:"category_id"`
}


// ดึงข้อมูล Service ทั้งหมด หรือกรองตาม Category
func GetServiceByCategory(c *gin.Context) {
	var services []entity.Service
	db := configs.DB

	CategoryID := c.Query("category_id")

	query := db.Preload("Category")

	if CategoryID != "" {
		query = query.Where("category_id = ?", CategoryID)
	}

	if err := query.Find(&services).Error; err != nil {
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

	// Validation
	if service.NameService == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name service is required"})
		return
	}
	if service.Cost <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cost must be greater than 0"})
		return
	}

	db := configs.DB
	if err := db.Create(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create service"})
		return
	}

	// ดึงข้อมูล service พร้อม category กลับไป
	db.Preload("Category").First(&service, service.ID)
	c.JSON(http.StatusCreated, service)
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

	// อัปเดตเฉพาะฟิลด์ที่ส่งมา
	if input.NameService != "" {
		service.NameService = input.NameService
	}
	if input.DetailService != "" {
		service.DetailService = input.DetailService
	}
	if input.Cost > 0 {
		service.Cost = input.Cost
	}
	if input.CategoryID > 0 {
		service.CategoryID = input.CategoryID
	}

	if err := db.Save(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update service"})
		return
	}

	// ดึงข้อมูล service พร้อม category กลับไป
	db.Preload("Category").First(&service, service.ID)
	c.JSON(http.StatusOK, service)
}

// ลบ Service
func DeleteService(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	var service entity.Service
	if err := db.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}

	if err := db.Delete(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete service"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Service deleted successfully"})
}