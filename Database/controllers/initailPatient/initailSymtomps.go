package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"

	"Database/configs"
	patientEntity "Database/entity/patient"
)

// POST /symptoms
func CreateSymptom(c *gin.Context) {
	var symptom patientEntity.InitialSymptomps
	if err := c.ShouldBindJSON(&symptom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//บันทึกลงฐานข้อมูล
	if err := DB.Model(&patientEntity.InitialSymptomps{}).Create(&symptom).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//preload patient data

	if err := DB.Preload("Patient").First(&symptom, symptom.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, symptom)
}


// //GET /symptoms by patient_id
// func FindSymptomsByPatientID(c *gin.Context) {

	
// 	var symptoms []patientEntity.InitialSymptomps
	
// 	id := c.Param("id")
// 	if tx := c.Param("id"){
// 		configs.DB().Preload("Patient").Where("patient_id = ?", id).Find(&symptoms)
// 	}

// 	c.JSON(http.StatusOK, symptoms)
// }