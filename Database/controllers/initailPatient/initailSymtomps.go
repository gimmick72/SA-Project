
package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"Database/configs"
	serviceEntity "Database/entity"
	patientEntity "Database/entity/patient"
)

func CreateSymptom(c *gin.Context) {
	var symptom patientEntity.InitialSymptomps

	if err := c.ShouldBindJSON(&symptom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	// อ่าน patient id จาก path
	pidStr := c.Param("id")
	pid, err := strconv.ParseUint(pidStr, 10, 64)
	if err != nil || pid == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient id"})
		return
	}
	symptom.PatientID = uint(pid)

	// เช็ค Patient มีจริง
	if tx := configs.DB.First(&patientEntity.Patient{}, symptom.PatientID); tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "patient not found"})
		return
	}

	// ✅ จัดการสถานะ
	// ถ้าไม่ได้ส่ง statusID มา หรือเป็น 0 -> ใช้สถานะ "รอคิว" เป็นค่าเริ่มต้น
	if symptom.StatusID == 0 {
		var st patientEntity.Status
		// หา status ชื่อ "รอคิว" (เผื่อชื่ออังกฤษด้วย)
		if err := configs.DB.
			Where("LOWER(status_name) IN ?", []string{"รอคิว", "waiting", "wait", "queued"}).
			First(&st).Error; err == nil {
			symptom.StatusID = st.ID
		}
	}

	// ต้องมี StatusID ที่ valid เสมอ
	if symptom.StatusID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "statusID is required"})
		return
	}

	// ตรวจสอบว่า status นี้มีจริง
	{
		var st patientEntity.Status
		if tx := configs.DB.First(&st, symptom.StatusID); tx.Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid statusID"})
			return
		}
	}

	// (ทางเลือก) ป้องกัน serviceID ไม่ตรงสคีมา
	// ถ้ามี serviceID ให้เช็คว่ามีจริง
	if symptom.ServiceID != nil {
		var svc serviceEntity.Service
		if tx := configs.DB.First(&svc, *symptom.ServiceID); tx.Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid serviceID"})
			return
		}
	}

	// บันทึก
	if err := configs.DB.Create(&symptom).Error; err != nil {
		// จัดข้อความ error ให้อ่านง่ายขึ้นหน่อย
		msg := err.Error()
		if strings.Contains(strings.ToLower(msg), "foreign key") {
			msg = "foreign key constraint failed (check patientID/statusID/serviceID)"
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// ✅ preload ความสัมพันธ์ที่ต้องการส่งกลับ
	if err := configs.DB.
		Preload("Patient").
		Preload("Status").
		Preload("Service").
		First(&symptom, symptom.ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, symptom)
}



// Get Service
func GetServicetoSymtompOption(c *gin.Context) {
	var services []serviceEntity.Service
	if err := configs.DB.
		Model(&serviceEntity.Service{}).
		Select("id", "name_service"). // ✅ ใช้คอลัมน์จริง
		Order("name_service").
		Find(&services).Error; err != nil { // ✅ ใช้ Find กับ Model เดียวกัน
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, services) // ✅ คืนเป็น []Service เดิม ไม่ต้อง DTO
}
