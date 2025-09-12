package controllers

import (
	
	"net/http"
	"github.com/gin-gonic/gin"
	"Database/configs"
	"Database/entity"
)

//POST /emergency-contacts
func CreateEmergencyContact(c *gin.Context) {
	
	var emergencyContact entity.ContactPerson
	if err := c.ShouldBindJSON(&emergencyContact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//บันทึกลงฐานข้อมูล
	if err := DB.Model(&entity.ContactPerson{}).Create(&emergencyContact).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, emergencyContact)
}

// GET /emergency-contacts
func FindEmergencyContacts(c *gin.Context) {

	var emergencyContacts []entity.ContactPerson
	db := configs.DB.
		Model(&entity.ContactPerson{})

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

	var emergencyContact entity.ContactPerson
	if err := c.ShouldBindJSON(&emergencyContact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//ตรวจสอบว่ามีข้อมูลในฐานข้อมูลหรือไม่
	var existingContact entity.ContactPerson
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