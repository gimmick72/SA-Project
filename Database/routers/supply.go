package routers

import (
	"Database/controllers"
	"github.com/gin-gonic/gin"
)


func SupplyRouter(router *gin.RouterGroup) {
		router.GET("/supplies", controllers.ListSupplies)
		router.POST("/supplies", controllers.CreateSupply)
		router.DELETE("/supplies/:id", controllers.DeleteSupply)
		router.POST("/dispenses", controllers.CreateDispense)
		router.GET("/dispenses", controllers.ListDispenses)
		router.PUT("/supplies/:id", controllers.UpdateSupply)
}
