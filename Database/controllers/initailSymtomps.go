package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"

	"Database/configs"
	entity "Database/entity"
	
)

// POST/initailPatient.go
func CreateSymptom(c *gin.Context) {
	var symptom entity.InitialSymptomps

	if err := c.ShouldBindJSON(&symptom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	// อ่าน id จากพาธ
	pidStr := c.Param("id")
	pid, err := strconv.ParseUint(pidStr, 10, 64)
	if err != nil || pid == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient id"})
		return
	}
	symptom.PatientID = uint(pid)

	// เช็คว่ามี patient นี้จริงไหม (กัน FK ล้ม)
	if tx := configs.DB.First(&entity.Patient{}, symptom.PatientID); tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
		return
	}

	// บันทึก
	if err := configs.DB.Create(&symptom).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// preload กลับ
	if err := configs.DB.Preload("Patient").First(&symptom, symptom.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, symptom)
}

// Get Service
func GetServicetoSymtompOption(c *gin.Context) {
	var services []entity.Service
	if err := configs.DB.
		Model(&entity.Service{}).
		Select("id", "name_service"). // ✅ ใช้คอลัมน์จริง
		Order("name_service").
		Find(&services).Error; err != nil { // ✅ ใช้ Find กับ Model เดียวกัน
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, services) // ✅ คืนเป็น []Service เดิม ไม่ต้อง DTO
}
