package routers

import (
	"Database/configs"

	"github.com/gin-gonic/gin"
	"Database/controllers/Dashboard"
)

func DashboardStaffRouter(router *gin.RouterGroup) {
	db := configs.DB
	initialController := controllers.NewInitialSymptompsController(db)

	// เรียกผ่าน method ของ struct controller
	router.GET("/dashboardStaff", initialController.GetTodayInitialSymptomps)
}
