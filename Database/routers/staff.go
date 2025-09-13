package routers

import (
	"Database/controllers/staff"
	"Database/middlewares"
	"github.com/gin-gonic/gin"
)


func StaffRouter(router *gin.RouterGroup) {
	staffGroup := router.Group("/staff")
	{
		// All staff routes require authentication for consistency
		staffGroup.Use(middlewares.Authorizes())
		
		staffGroup.GET("", controllers.GetAllStaff)
		staffGroup.GET("/:id", controllers.GetStaffByID)
		staffGroup.PUT("/:id", controllers.UpdateStaff)
		staffGroup.POST("", controllers.AddStaff)
		staffGroup.DELETE("/:id", controllers.DeleteStaff)
	}
}
