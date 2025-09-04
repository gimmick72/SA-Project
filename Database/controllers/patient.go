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
func FindPatient(c *gin.Context) {
    var patients []patientEntity.Patient
    db := configs.DB.
        Model(&patientEntity.Patient{}).
        Preload("Address").
        Preload("ContactPerson").
        Preload("InitialSymptomps").
        Preload("Histories") // <-- ชื่อต้องตรงกับฟิลด์ใน struct

    patientID := c.Query("patientID")
    if patientID != "" {
        if err := db.Where("id = ?", patientID).Find(&patients).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
    } else {
        if err := db.Find(&patients).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(http.StatusOK, gin.H{"data": patients})
}


// PUT /patients/:id
func UpdatePatient(c *gin.Context) {
    var patient patientEntity.Patient
    if err := c.ShouldBindJSON(&patient); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if tx := configs.DB.Model(&patientEntity.Patient{}).
        Where("id = ?", patient.ID).
        Updates(&patient); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "คนไข้ไม่มีประวัติในระบบ"})
        return
    }

    if err := configs.DB.
        Preload("Address").
        Preload("ContactPerson").
        Preload("InitialSymptomps").
        Preload("Histories").
        First(&patient, patient.ID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลคนไข้เรียบร้อย"})
}

// GET /patients/:id
func GetPatientByID(c *gin.Context) {
    var patient patientEntity.Patient
    id := c.Param("id")

    if err := configs.DB.
        Preload("Address").
        Preload("ContactPerson").
        Preload("InitialSymptomps").
        Preload("Histories").
        First(&patient, id).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลคนไข้"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": patient})
}

// DELETE /patients/:id
func DeletePatient(c *gin.Context) {
	patientID := c.Param("id")

	if tx := configs.DB.Delete(&patientEntity.Patient{}, patientID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลคนไข้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลคนไข้เรียบร้อย"})
}

