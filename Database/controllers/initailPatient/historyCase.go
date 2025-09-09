package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"Database/configs"
	// patientEntity "Database/entity/patient" // ถ้าต้อง preload Patient
	caseEntity "Database/entity"            // ที่มี struct CaseData, Treatment, Dentist ฯลฯ
)

// GET /api/case-data/:id   -> :id คือ patientID
func GetCaseHistory(c *gin.Context) {
	idStr := c.Param("id")
	pid, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil || pid == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient id"})
		return
	}

	var cases []caseEntity.CaseData

	tx := configs.DB.
		Where("patient_id = ?", pid).
		Preload("Patient").    // ถ้าต้องการชื่อคนไข้
		Preload("Department"). // ดึงข้อมูลแผนก
		Preload("Treatments"). // รายการหัตถการในเคส
		Order("created_at DESC").
		Find(&cases)

	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": tx.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cases})
}
