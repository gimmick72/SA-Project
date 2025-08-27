package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)

// POST /patient
func AddNewPatient(c *gin.Context) {
	var payload entity.Patient

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ถ้า BirthDay ไม่มีค่า ให้ใช้วันปัจจุบัน
	if payload.BirthDay.IsZero() {
		payload.BirthDay = time.Now()
	}

	// save to DB
	if err := configs.DB.Create(&payload).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Add Patient successful", "data": payload})
}

// GET /Patient
func FindPatients(c *gin.Context) {
	var patients []entity.Patient

	//parameter patient_id
	PatientID := c.Query("patient_id")

	if PatientID != "" {
		if err := configs.DB.Preload("Patient").Raw("SELECT * FROM Patient WHERE patient_id=?,PatientID).Find(&Patient").Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := configs.DB.Preload("Patient").Raw("SELECT * FROM Patient").Find(&patients).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, patients)

}

// GET /Patient/:id
func FindPatientById(c *gin.Context) {
	var patient entity.Patient
	//
	id := c.Param("id")
	if err := configs.DB.Where("patient_id = ?", id).First(&patient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})

}

// DELETE /Patient/:id
func DeletePatientById(c *gin.Context) {
	id := c.Param("id")
	if tx := configs.DB.Exec("DELETE FROM patient WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted succesful"})
}
