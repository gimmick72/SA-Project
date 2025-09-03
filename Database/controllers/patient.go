package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity/patient"
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