package routers

import (
	"Database/controllers"
	"github.com/gin-gonic/gin"
)


func StaffRouter(router *gin.RouterGroup) {
	router.GET("/staff", controllers.GetAllStaff)
	router.GET("/staff/:id", controllers.GetStaffByID)
	router.PUT("/staff/:id", controllers.UpdateStaff)
	router.POST("/staff", controllers.AddStaff)
	router.DELETE("/staff/:id", controllers.DeleteStaff)
}
