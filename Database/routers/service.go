package routers

import (
	"Database/controllers"
	"github.com/gin-gonic/gin"
)

func ServiceRouter(router *gin.RouterGroup) {
	// Service
	router.GET("/Service_controller", controllers.GetServiceByCategory)
	router.POST("/Service_controller", controllers.CreateService)
	router.PUT("/Service_controller/:id", controllers.UpdateService)
	router.DELETE("/Service_controller/:id", controllers.DeleteService)

	// Category
	router.GET("/category_controller", controllers.ListCategories)
	router.POST("/category_controller", controllers.CreateCategory)
	router.PUT("/category_controller/:id", controllers.UpdateCategory)
	router.DELETE("/category_controller/:id", controllers.DeleteCategory)

	// Promotion
	router.GET("/promotion_controller", controllers.ListPromotions)
	router.POST("/promotion_controller", controllers.CreatePromotion)
	router.PUT("/promotion_controller/:id", controllers.UpdatePromotion)
	router.DELETE("/promotion_controller/:id", controllers.DeletePromotion)

}

