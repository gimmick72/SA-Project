package routers

import (
	"Database/controllers/workschedule"
	"Database/middlewares"

	"github.com/gin-gonic/gin"
)

func WorkScheduleRoutes(router *gin.RouterGroup) {
	// Apply authentication middleware
	workScheduleGroup := router.Group("/work-schedule")
	workScheduleGroup.Use(middlewares.Authorizes())

	// CRUD routes
	workScheduleGroup.POST("", workschedule.CreateWorkSchedule)           // Create new work schedule
	workScheduleGroup.GET("", workschedule.GetWorkSchedules)              // Get all work schedules with filters
	workScheduleGroup.GET("/:id", workschedule.GetWorkSchedule)           // Get specific work schedule
	workScheduleGroup.PUT("/:id", workschedule.UpdateWorkSchedule)        // Update work schedule
	workScheduleGroup.DELETE("/:id", workschedule.DeleteWorkSchedule)     // Delete work schedule

	// Additional routes
	workScheduleGroup.GET("/stats", workschedule.GetWorkScheduleStats)    // Get statistics
	workScheduleGroup.GET("/staff/:staff_id", workschedule.GetStaffSchedules) // Get schedules for specific staff
}
