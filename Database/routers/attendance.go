package routers

import (
	attendanceControllers "Database/controllers/attendance"
	"Database/middlewares"

	"github.com/gin-gonic/gin"
)

func AttendanceRouter(router *gin.RouterGroup) {
	attendanceGroup := router.Group("/attendance")
	{
		// All attendance routes require authentication
		attendanceGroup.Use(middlewares.Authorizes())
		
		// Attendance CRUD operations
		attendanceGroup.POST("", attendanceControllers.CreateAttendance)
		attendanceGroup.GET("", attendanceControllers.GetAttendances)
		attendanceGroup.GET("/:id", attendanceControllers.GetAttendance)
		attendanceGroup.PUT("/:id", attendanceControllers.UpdateAttendance)
		attendanceGroup.DELETE("/:id", attendanceControllers.DeleteAttendance)
		
		// Check-in/Check-out operations
		attendanceGroup.POST("/checkin", attendanceControllers.CheckIn)
		attendanceGroup.POST("/checkout", attendanceControllers.CheckOut)
		
		// Statistics
		attendanceGroup.GET("/stats", attendanceControllers.GetAttendanceStats)
	}
}
