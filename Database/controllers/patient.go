package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Database/configs"
	entity "Database/entity"
)

// POST /api/patients
func CreatePatient(c *gin.Context) {
	var patient entity.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient", "details": err.Error()})
		return
	}

	// ป้องกันเลขบัตรประชาชนซ้ำ
	var exist entity.Patient
	if tx := configs.DB.Where("citizen_id = ?", patient.CitizenID).First(&exist); tx.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "คนไข้มีประวัติแล้ว"})
		return
	}

	// สร้าง Patient พร้อมบันทึก Address/ContactPerson ในคำสั่งเดียว
	// เปิด FullSaveAssociations เพื่อให้ GORM บันทึก associations แน่นอน
	db := configs.DB.Session(&gorm.Session{FullSaveAssociations: true})

	if err := db.Create(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "create failed", "details": err.Error()})
		return
	}

	// preload กลับให้ครบ (optional)
	var created entity.Patient
	if err := db.
		Preload("Address").
		Preload("ContactPerson").
		First(&created, patient.ID).Error; err != nil {
		created = patient
	}

	c.JSON(http.StatusCreated, gin.H{"data": created})
}

// GET /api/patients  (?patientID=)
func FindPatient(c *gin.Context) {
	var patients []entity.Patient
	db := configs.DB.Model(&entity.Patient{}).
		Preload("Address").
		Preload("ContactPerson").
		Preload("InitialSymptomps").
		Preload("Histories")

	if pid := c.Query("patientID"); pid != "" {
		if err := db.Where("id = ?", pid).Find(&patients).Error; err != nil {
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

// GET /api/patients/:id
func GetPatientByID(c *gin.Context) {
	id := c.Param("id")
	var patient entity.Patient

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

// PUT /api/patients/:id
func UpdatePatient(c *gin.Context) {
	id := c.Param("id")
	var payload entity.Patient

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload", "details": err.Error()})
		return
	}

	// อัปเดตฟิลด์หลักของ Patient
	if tx := configs.DB.Model(&entity.Patient{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"citizenID":        payload.CitizenID,
			"prefix":            payload.Prefix,
			"firstname":        payload.FirstName,
			"lastname":         payload.LastName,
			"nick_name":         payload.NickName,
			"congenita_disease": payload.CongenitaDisease,
			"blood_type":        payload.BloodType,
			"gender":            payload.Gender,
			"birthday":         payload.Birthday, // ต้องส่ง "YYYY-MM-DD" จาก FE ตาม time_format
			"phone_number":      payload.PhoneNumber,
			"age":               payload.Age,
			"drug_allergy":      payload.DrugAllergy,
		}); tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": tx.Error.Error()})
		return
	}

	// Upsert Address
	if payload.Address != nil {
		var addr entity.Address
		if err := configs.DB.Where("patient_id = ?", id).First(&addr).Error; err == nil {
			// update
			if err := configs.DB.Model(&addr).Updates(map[string]interface{}{
				"house_number": payload.Address.HouseNumber,
				"moo":          payload.Address.Moo,
				"subdistrict":  payload.Address.Subdistrict,
				"district":     payload.Address.District,
				"province":     payload.Address.Province,
				"postcode":     payload.Address.Postcode,
			}).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "update address failed", "details": err.Error()})
				return
			}
		} else {
			// create
			payload.Address.PatientID = uintFromString(id)
			if err := configs.DB.Create(payload.Address).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "create address failed", "details": err.Error()})
				return
			}
		}
	}

	// Upsert ContactPerson
	if payload.ContactPerson != nil {
		var cp entity.ContactPerson
		if err := configs.DB.Where("patient_id = ?", id).First(&cp).Error; err == nil {
			// update (สำคัญ: ใช้ key "phone_number" ให้ถูกชื่อ column)
			if err := configs.DB.Model(&cp).Updates(map[string]interface{}{
				"relationship": payload.ContactPerson.Relationship,
				"phone_number": payload.ContactPerson.PhoneNumber,
			}).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "update contact person failed", "details": err.Error()})
				return
			}
		} else {
			// create
			payload.ContactPerson.PatientID = uintFromString(id)
			if err := configs.DB.Create(payload.ContactPerson).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "create contact person failed", "details": err.Error()})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลคนไข้เรียบร้อย"})
}

// DELETE /api/patients/:id
func DeletePatient(c *gin.Context) {
	id := c.Param("id")
	if err := configs.DB.Unscoped().Where("id = ?", id).Delete(&entity.Patient{}).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลคนไข้เรียบร้อย"})
}

func uintFromString(s string) uint {
	var n uint
	_, _ = fmt.Sscanf(s, "%d", &n)
	return n
}
