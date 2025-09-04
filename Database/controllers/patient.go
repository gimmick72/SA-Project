package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	patientEntity "Database/entity/patient"
)

// POST /patients
func CreatePatient(c *gin.Context) {

	var patient patientEntity.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	// ตรวจสอบเลขบัตรประชาชน
	var citizenID patientEntity.Patient
	if tx := DB.Where("citizen_id = ?", patient.CitizenID).First(&citizenID); tx.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "คนไข้มีประวัติแล้ว"})
		return
	}

	//บันทึกลงฐานข้อมูล
	if err := DB.Model(&patientEntity.Patient{}).Create(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, patient)
}

// GET /patients
func GetPatient(c *gin.Context) {
	DB := configs.DB

	var patients []patientEntity.Patient
	if err := DB.Find(&patients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, patients)
}

// controllers/patient.go (ต่อจากของเดิม)
func GetPatientByID(c *gin.Context) {
	DB := configs.DB
	var p patientEntity.Patient
	id := c.Param("id")
	if tx := DB.First(&p, id); tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, p)
}

func DeletePatient(c *gin.Context) {
	DB := configs.DB
	id := c.Param("id")
	if tx := DB.Delete(&patientEntity.Patient{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบแล้ว"})
}
