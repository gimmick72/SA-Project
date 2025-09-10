package routers

import (
	"Database/controllers/treatment"
	"github.com/gin-gonic/gin"
)

func CaseDataRouter(router *gin.RouterGroup) {
	router.GET("/cases", controllers.GetCases)
	router.GET("/cases/:id", controllers.GetCaseByID)
	router.POST("/cases", controllers.CreateCase)
	router.PUT("/cases/:id", controllers.UpdateCase)
	router.DELETE("/cases/:id", controllers.DeleteCase)
	router.GET("/cases/patients", controllers.GetPatientByCitizenID) // <-- เพิ่ม
}

