package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"

	"Database/configs"
	patientEntity "Database/entity/patient"
	serviceEntity "Database/entity"
	
)
// POST /api/patients/:id/symptoms
func CreateSymptom(c *gin.Context) {
    var symptom patientEntity.InitialSymptomps
    if err := c.ShouldBindJSON(&symptom); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // กำหนด PatientID จากพาธชัดเจน (กัน user ยัดค่ามั่ว)
    if pid, err := strconv.Atoi(c.Param("id")); err == nil {
        symptom.PatientID = uint(pid)
    } else {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient id"})
        return
    }

    // กัน payload ส่ง ID (ของอาการ) มาด้วย
    symptom.ID = 0

    if err := configs.DB.Create(&symptom).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // preload ที่ต้องใช้แสดงผล
    if err := configs.DB.
        Preload("Patient").
        Preload("Service").
        First(&symptom, symptom.ID).Error; err != nil {
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

//Get Service
func GetServicetoSymtompOption(c *gin.Context) {
	var services []serviceEntity.Service
	if err := configs.DB.
		Model(&serviceEntity.Service{}).
		Select("id", "name_service").          // ✅ ใช้คอลัมน์จริง
		Order("name_service").
		Find(&services).Error; err != nil {     // ✅ ใช้ Find กับ Model เดียวกัน
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, services) // ✅ คืนเป็น []Service เดิม ไม่ต้อง DTO
}