package workschedule

import (
	"Database/configs"
	"Database/entity"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateWorkSchedule creates a new work schedule
func CreateWorkSchedule(c *gin.Context) {
	var schedule entity.WorkSchedule

	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if schedule.StaffID == 0 || schedule.Date == "" || schedule.StartTime == "" || schedule.EndTime == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Check if staff exists
	var staff entity.PersonalData
	if err := configs.DB.First(&staff, schedule.StaffID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Staff not found"})
		return
	}

	// Create the schedule
	if err := configs.DB.Create(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create work schedule"})
		return
	}

	// Load staff data for response
	configs.DB.Preload("Staff").First(&schedule, schedule.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Work schedule created successfully",
		"data":    schedule,
	})
}

// GetWorkSchedules retrieves work schedules with optional filters
func GetWorkSchedules(c *gin.Context) {
	var schedules []entity.WorkSchedule
	query := configs.DB.Preload("Staff")

	// Apply filters
	if staffID := c.Query("staff_id"); staffID != "" {
		query = query.Where("staff_id = ?", staffID)
	}

	if startDate := c.Query("start_date"); startDate != "" {
		query = query.Where("date >= ?", startDate)
	}

	if endDate := c.Query("end_date"); endDate != "" {
		query = query.Where("date <= ?", endDate)
	}

	if shiftType := c.Query("shift_type"); shiftType != "" {
		query = query.Where("shift_type = ?", shiftType)
	}

	// Add pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	offset := (page - 1) * pageSize

	// Get total count
	var total int64
	query.Model(&entity.WorkSchedule{}).Count(&total)

	// Get schedules with pagination
	if err := query.Offset(offset).Limit(pageSize).Order("date DESC").Find(&schedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve work schedules"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": schedules,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetWorkSchedule retrieves a single work schedule by ID
func GetWorkSchedule(c *gin.Context) {
	id := c.Param("id")
	var schedule entity.WorkSchedule

	if err := configs.DB.Preload("Staff").First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Work schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve work schedule"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": schedule})
}

// UpdateWorkSchedule updates an existing work schedule
func UpdateWorkSchedule(c *gin.Context) {
	id := c.Param("id")
	var schedule entity.WorkSchedule

	// Check if schedule exists
	if err := configs.DB.First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Work schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find work schedule"})
		}
		return
	}

	// Bind updated data
	var updateData entity.WorkSchedule
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate staff exists if staff_id is being updated
	if updateData.StaffID != 0 && updateData.StaffID != schedule.StaffID {
		var staff entity.PersonalData
		if err := configs.DB.First(&staff, updateData.StaffID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Staff not found"})
			return
		}
	}

	// Update the schedule
	if err := configs.DB.Model(&schedule).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update work schedule"})
		return
	}

	// Load updated data with staff
	configs.DB.Preload("Staff").First(&schedule, schedule.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Work schedule updated successfully",
		"data":    schedule,
	})
}

// DeleteWorkSchedule deletes a work schedule
func DeleteWorkSchedule(c *gin.Context) {
	id := c.Param("id")
	var schedule entity.WorkSchedule

	// Check if schedule exists
	if err := configs.DB.First(&schedule, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Work schedule not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find work schedule"})
		}
		return
	}

	// Delete the schedule
	if err := configs.DB.Delete(&schedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete work schedule"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Work schedule deleted successfully"})
}

// GetWorkScheduleStats returns statistics about work schedules
func GetWorkScheduleStats(c *gin.Context) {
	var stats struct {
		TotalSchedules   int64 `json:"total_schedules"`
		ActiveSchedules  int64 `json:"active_schedules"`
		TodaySchedules   int64 `json:"today_schedules"`
		WeekSchedules    int64 `json:"week_schedules"`
		MonthSchedules   int64 `json:"month_schedules"`
		StaffCount       int64 `json:"staff_count"`
	}

	today := time.Now().Format("2006-01-02")
	weekStart := time.Now().AddDate(0, 0, -int(time.Now().Weekday())).Format("2006-01-02")
	monthStart := time.Now().AddDate(0, 0, -time.Now().Day()+1).Format("2006-01-02")

	// Total schedules
	configs.DB.Model(&entity.WorkSchedule{}).Count(&stats.TotalSchedules)

	// Active schedules
	configs.DB.Model(&entity.WorkSchedule{}).Where("is_active = ?", true).Count(&stats.ActiveSchedules)

	// Today's schedules
	configs.DB.Model(&entity.WorkSchedule{}).Where("date = ?", today).Count(&stats.TodaySchedules)

	// This week's schedules
	configs.DB.Model(&entity.WorkSchedule{}).Where("date >= ?", weekStart).Count(&stats.WeekSchedules)

	// This month's schedules
	configs.DB.Model(&entity.WorkSchedule{}).Where("date >= ?", monthStart).Count(&stats.MonthSchedules)

	// Staff with schedules
	configs.DB.Model(&entity.WorkSchedule{}).Distinct("staff_id").Count(&stats.StaffCount)

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

// GetStaffSchedules retrieves schedules for a specific staff member
func GetStaffSchedules(c *gin.Context) {
	staffID := c.Param("staff_id")
	var schedules []entity.WorkSchedule

	query := configs.DB.Preload("Staff").Where("staff_id = ?", staffID)

	// Apply date filters
	if startDate := c.Query("start_date"); startDate != "" {
		query = query.Where("date >= ?", startDate)
	}

	if endDate := c.Query("end_date"); endDate != "" {
		query = query.Where("date <= ?", endDate)
	}

	if err := query.Order("date DESC").Find(&schedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve staff schedules"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": schedules})
}
