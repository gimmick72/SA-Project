package routers

import (
	"github.com/gin-gonic/gin"
	"Database/controllers/dentistManagement"
)

func DentisMenagementRouter(router *gin.RouterGroup) {
	router.GET("/dentistmanagement_controller", controllers.GetAllDentistManagement)
	router.GET("/dentistmanagement_controller/:id", controllers.GetDentistManagementByID)
	router.POST("/dentistmanagement_controller", controllers.CreateDentistManagement)
	router.PUT("/dentistmanagement_controller/:id", controllers.UpdateDentistManagement)
	router.DELETE("/dentistmanagement_controller/:id", controllers.DeleteDentistManagement)
}
