//caseController.go
package controllers

import (
	"Database/configs"
	"Database/entity"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)
func GetPatientByCitizenID(c *gin.Context) {
    citizenId := c.Query("citizenId")
    if citizenId == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "citizenId is required"})
        return
    }

    var patient entity.Patient
    if err := configs.DB.Where("citizen_id = ?", citizenId).Preload("Address").Preload("ContactPerson").Preload("InitialSymptomps").First(&patient).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
        return
    }

    c.JSON(http.StatusOK, patient)
}
// ------------------- GET ALL CASES -------------------
func GetCases(c *gin.Context) {
	var cases []entity.CaseData

	// preload relations
	if err := configs.DB.
		Preload("Patient").
		Preload("Department.PersonalData").
		Preload("Treatment.Quadrants").
		Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cases)
}

// ------------------- GET CASE BY ID -------------------
func GetCaseByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var caseData entity.CaseData

	if err := configs.DB.
		Preload("Patient.InitialSymptomps").
		Preload("Department.PersonalData"). // ✅ โหลดชื่อหมอ
		Preload("Treatment.Quadrants").
		First(&caseData, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Case not found"})
		return
	}

	c.JSON(http.StatusOK, caseData)
}

// ------------------- CREATE CASE -------------------
func CreateCase(c *gin.Context) {
	var newCase entity.CaseData
	if err := c.ShouldBindJSON(&newCase); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := configs.DB.Create(&newCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newCase)
}

// ------------------- UPDATE CASE -------------------
func UpdateCase(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var existing entity.CaseData

    if err := configs.DB.Preload("Treatment").Preload("Patient").First(&existing, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Case not found"})
        return
    }

    var input entity.CaseData
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // update main fields
    existing.SignDate = input.SignDate
    existing.Note = input.Note
    existing.PatientID = input.PatientID
    existing.DepartmentID = input.DepartmentID
    existing.Appointment_date = input.Appointment_date
    existing.TotalPrice = input.TotalPrice

    // ลบ Treatment เก่า แล้วเพิ่มใหม่ (หรือจะอัปเดตทีละรายการก็ได้)
    if len(input.Treatment) > 0 {
        // ลบของเก่าก่อน
        configs.DB.Where("case_data_id = ?", existing.ID).Delete(&entity.Treatment{})
        // เพิ่มใหม่
        for _, t := range input.Treatment {
            t.CaseDataID = existing.ID
            configs.DB.Create(&t)
        }
    }

    if err := configs.DB.Save(&existing).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // reload พร้อม relation (Patient, Treatment)
    var updated entity.CaseData
    configs.DB.Preload("Treatment").Preload("Patient").First(&updated, existing.ID)

    c.JSON(http.StatusOK, updated)
}


// ------------------- DELETE CASE -------------------
func DeleteCase(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := configs.DB.Delete(&entity.CaseData{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case deleted successfully"})
}
