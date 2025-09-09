package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"Database/configs"
	entity "Database/entity"
)

//POST /Booking-Queue
func CreateQueue(c *gin.Context) {
	var queue entity.Queue
	if err := c.ShouldBindJSON(&queue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	DB := configs.DB

	//บันทึกลงฐานข้อมูล
	if err := DB.Create(&queue).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, queue)
}

//GET /Booking-Queue
func FindQueueBooking(c *gin.Context) {

	var queues []entity.Queue
	DB := configs.DB
	DB.Model(&entity.Queue{}).Preload("Patient").Preload("Service").Preload("Timeslot").Find(&queues)

	c.JSON(http.StatusOK, queues)
}
