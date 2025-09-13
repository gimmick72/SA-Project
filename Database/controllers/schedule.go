package controllers

import (
	"net/http"
	"strconv"
	"time"

	"Database/configs"
	"Database/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateSchedule creates a new schedule
func CreateSchedule(c *gin.Context) {
	var req entity.ScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	db := configs.DB

	// Verify staff exists
	var staff entity.PersonalData
	if err := db.First(&staff, req.StaffID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Staff not found"})
		return
	}

	// Parse date and times
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	startTime, err := time.Parse("15:04", req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format. Use HH:MM"})
		return
	}

	endTime, err := time.Parse("15:04", req.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format. Use HH:MM"})
		return
	}

	// Set default status if not provided
	status := req.Status
	if status == "" {
		status = "scheduled"
	}

	// Create schedule
	schedule := entity.Schedule{
		StaffID:   req.StaffID,
		Date:      date,
		StartTime: startTime,
		EndTime:   endTime,
		ShiftType: req.ShiftType,
		Status:    status,
		Notes:     req.Notes,
	}

	if err := db.Create(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create schedule", "details": err.Error()})
		return
	}

	// Load the schedule with staff data
	if err := db.Preload("Staff").First(&schedule, schedule.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load schedule data"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Schedule created successfully",
		"data":    schedule.ToResponse(),
	})
}

// GetSchedules retrieves schedules with filtering and pagination
func GetSchedules(c *gin.Context) {
	db := configs.DB

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	staffID := c.Query("staff_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	status := c.Query("status")
	shiftType := c.Query("shift_type")

	// Build query
	query := db.Model(&entity.Schedule{}).Preload("Staff")

	// Apply filters
	if staffID != "" {
		query = query.Where("staff_id = ?", staffID)
	}
	if startDate != "" {
		query = query.Where("date >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("date <= ?", endDate)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if shiftType != "" {
		query = query.Where("shift_type = ?", shiftType)
	}

	// Count total records
	var total int64
	query.Count(&total)

	// Apply pagination
	offset := (page - 1) * pageSize
	query = query.Offset(offset).Limit(pageSize)

	// Order by date and start time
	query = query.Order("date ASC, start_time ASC")

	var schedules []entity.Schedule
	if err := query.Find(&schedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve schedules"})
		return
	}

	// Convert to response format
	var responses []entity.ScheduleResponse
	for _, schedule := range schedules {
		responses = append(responses, schedule.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       responses,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetSchedule retrieves a specific schedule by ID
func GetSchedule(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	var schedule entity.Schedule
	if err := db.Preload("Staff").First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve schedule"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": schedule.ToResponse(),
	})
}

// UpdateSchedule updates an existing schedule
func UpdateSchedule(c *gin.Context) {
	id := c.Param("id")
	var req entity.ScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	db := configs.DB

	var schedule entity.Schedule
	if err := db.First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find schedule"})
		}
		return
	}

	// Parse date and times
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	startTime, err := time.Parse("15:04", req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format. Use HH:MM"})
		return
	}

	endTime, err := time.Parse("15:04", req.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format. Use HH:MM"})
		return
	}

	// Update schedule fields
	schedule.StaffID = req.StaffID
	schedule.Date = date
	schedule.StartTime = startTime
	schedule.EndTime = endTime
	schedule.ShiftType = req.ShiftType
	schedule.Status = req.Status
	schedule.Notes = req.Notes

	if err := db.Save(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update schedule"})
		return
	}

	// Load updated schedule with staff data
	if err := db.Preload("Staff").First(&schedule, schedule.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Schedule updated successfully",
		"data":    schedule.ToResponse(),
	})
}

// DeleteSchedule deletes a schedule
func DeleteSchedule(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	var schedule entity.Schedule
	if err := db.First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find schedule"})
		}
		return
	}

	if err := db.Delete(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Schedule deleted successfully",
	})
}

// GenerateWeeklySchedule generates schedules for multiple staff for a week
func GenerateWeeklySchedule(c *gin.Context) {
	var req entity.WeeklyScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	db := configs.DB

	// Parse dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
		return
	}

	// Set defaults
	shiftType := req.ShiftType
	if shiftType == "" {
		shiftType = "full_day"
	}

	startTime, err := time.Parse("15:04", req.StartTime)
	if err != nil {
		startTime, _ = time.Parse("15:04", "08:00") // Default start time
	}

	endTime, err := time.Parse("15:04", req.EndTime)
	if err != nil {
		endTime, _ = time.Parse("15:04", "17:00") // Default end time
	}

	var createdSchedules []entity.Schedule
	var skippedCount int

	// Generate schedules for each staff and each day
	for _, staffID := range req.StaffIDs {
		currentDate := startDate
		for currentDate.Before(endDate) || currentDate.Equal(endDate) {
			// Skip weekends (Saturday = 6, Sunday = 0)
			if currentDate.Weekday() != time.Saturday && currentDate.Weekday() != time.Sunday {
				// Check if schedule already exists
				var existingSchedule entity.Schedule
				if err := db.Where("staff_id = ? AND date = ?", staffID, currentDate).First(&existingSchedule).Error; err == gorm.ErrRecordNotFound {
					// Create new schedule
					schedule := entity.Schedule{
						StaffID:   staffID,
						Date:      currentDate,
						StartTime: startTime,
						EndTime:   endTime,
						ShiftType: shiftType,
						Status:    "scheduled",
						Notes:     "Auto-generated weekly schedule",
					}

					if err := db.Create(&schedule).Error; err == nil {
						createdSchedules = append(createdSchedules, schedule)
					}
				} else {
					skippedCount++
				}
			}
			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":         "Weekly schedules generated successfully",
		"created_count":   len(createdSchedules),
		"skipped_count":   skippedCount,
		"total_requested": len(req.StaffIDs) * int(endDate.Sub(startDate).Hours()/24+1),
	})
}

// GetScheduleStats returns schedule statistics
func GetScheduleStats(c *gin.Context) {
	db := configs.DB

	var stats entity.ScheduleStatsResponse

	// Count total schedules
	db.Model(&entity.Schedule{}).Count(&stats.TotalSchedules)

	// Count by status
	db.Model(&entity.Schedule{}).Where("status = ?", "confirmed").Count(&stats.ConfirmedSchedules)
	db.Model(&entity.Schedule{}).Where("status = ?", "scheduled").Count(&stats.PendingSchedules)
	db.Model(&entity.Schedule{}).Where("status = ?", "cancelled").Count(&stats.CancelledSchedules)

	// Count unique staff with schedules
	db.Model(&entity.Schedule{}).Distinct("staff_id").Count(&stats.StaffCount)

	c.JSON(http.StatusOK, gin.H{
		"data": stats,
	})
}
