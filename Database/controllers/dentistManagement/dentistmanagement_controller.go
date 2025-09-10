package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Database/configs"
	"Database/entity"

)

// ------------------- API Handlers -------------------

// สร้างจองทันตแพทย์
func CreateDentistManagement(c *gin.Context) {
	var booking entity.DentistManagement
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := configs.DB
	if err := db.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// ดึงข้อมูลทั้งหมด
func GetAllDentistManagement(c *gin.Context) {
	var bookings []entity.DentistManagement
	db := configs.DB
	if err := db.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bookings"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// ดึงข้อมูลโดย ID
func GetDentistManagementByID(c *gin.Context) {
	id := c.Param("id")
	var booking entity.DentistManagement
	db := configs.DB
	if err := db.First(&booking, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get booking"})
		}
		return
	}
	c.JSON(http.StatusOK, booking)
}

// แก้ไขข้อมูล
func UpdateDentistManagement(c *gin.Context) {
	id := c.Param("id")
	var booking entity.DentistManagement
	db := configs.DB

	if err := db.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	var input entity.DentistManagement
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking.Room = input.Room
	booking.TimeIn = input.TimeIn
	booking.TimeOut = input.TimeOut
	booking.Dentist = input.Dentist

	if err := db.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// ลบข้อมูล
func DeleteDentistManagement(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	if err := db.Delete(&entity.DentistManagement{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted"})
}
