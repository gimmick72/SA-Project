package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Database/configs"

)

// Struct ของ DentistManagement
type DentistManagement struct {
	ID      uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Room    string    `json:"room"`
	Date    time.Time `json:"date"`
	TimeIn  time.Time `json:"time_in"`
	TimeOut time.Time `json:"time_out"`
	Dentist string    `json:"dentist"`
}

// ------------------- API Handlers -------------------

// สร้างจองทันตแพทย์
func CreateDentistMenagement(c *gin.Context) {
	var booking DentistManagement
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
func GetAllDentistMenagement(c *gin.Context) {
	var bookings []DentistManagement
	db := configs.DB
	if err := db.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bookings"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// ดึงข้อมูลโดย ID
func GetDentistMenagementByID(c *gin.Context) {
	id := c.Param("id")
	var booking DentistManagement
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
func UpdateDentistMenagement(c *gin.Context) {
	id := c.Param("id")
	var booking DentistManagement
	db := configs.DB

	if err := db.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	var input DentistManagement
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	booking.Room = input.Room
	booking.Date = input.Date
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
func DeleteDentistMenagement(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	if err := db.Delete(&DentistManagement{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted"})
}
