package routers

import (
	"Database/controllers"
	"Database/middlewares"

	"github.com/gin-gonic/gin"
)

func ScheduleRoutes(r *gin.RouterGroup) {
	scheduleGroup := r.Group("/staff-schedule")
	scheduleGroup.Use(middlewares.Authorizes()) // Require authentication

	// CRUD operations
	scheduleGroup.POST("", controllers.CreateSchedule)
	scheduleGroup.GET("", controllers.GetSchedules)
	scheduleGroup.GET("/:id", controllers.GetSchedule)
	scheduleGroup.PUT("/:id", controllers.UpdateSchedule)
	scheduleGroup.DELETE("/:id", controllers.DeleteSchedule)

	// Special operations
	scheduleGroup.POST("/weekly", controllers.GenerateWeeklySchedule)
	scheduleGroup.GET("/stats", controllers.GetScheduleStats)
}
