package controllers

import (
	
	"net/http"
	"github.com/gin-gonic/gin"
	"Database/configs"
	patientEntity "Database/entity/patient"
)

//POST /emergency-contacts
func CreateEmergencyContact(c *gin.Context) {
	
	var emergencyContact patientEntity.ContactPerson
	if err := c.ShouldBindJSON(&emergencyContact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//บันทึกลงฐานข้อมูล
	if err := DB.Model(&patientEntity.ContactPerson{}).Create(&emergencyContact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, emergencyContact)
}

// GET /emergency-contacts
func FindEmergencyContacts(c *gin.Context) {

	var emergencyContacts []patientEntity.ContactPerson
	db := configs.DB.
		Model(&patientEntity.ContactPerson{})

	contactID := c.Query("contactID")
	if contactID != "" {
		if err := db.Where("id = ?", contactID).Find(&emergencyContacts).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		if err := db.Find(&emergencyContacts).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, emergencyContacts)
}

//PUT /emergency-contacts
func UpdateEmergencyContact(c *gin.Context) {

	var emergencyContact patientEntity.ContactPerson
	if err := c.ShouldBindJSON(&emergencyContact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
	var existingContact patientEntity.ContactPerson
	if tx := DB.Where("id = ?", emergencyContact.ID).First(&existingContact); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่มีข้อมูลผู้ติดต่อฉุกเฉิน"})
		return
	}

	//บันทึกลงฐานข้อมูล
	if err := DB.Model(&existingContact).Updates(emergencyContact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, existingContact)
}