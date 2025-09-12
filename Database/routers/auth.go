package routers

import (
	"Database/controllers"
	"Database/middlewares"

	"github.com/gin-gonic/gin"
)

func AuthRouter(router *gin.RouterGroup) {
	authGroup := router.Group("/auth")
	{
		// Public authentication routes
		authGroup.POST("/register", controllers.Register)
		authGroup.POST("/login", controllers.Login)
		authGroup.POST("/logout", controllers.Logout)
	}

	// Protected routes requiring authentication
	profileGroup := router.Group("/profile")
	{
		profileGroup.Use(middlewares.Authorizes())
		profileGroup.GET("", controllers.GetProfile)
		profileGroup.PUT("", controllers.UpdateProfile)
		profileGroup.PUT("/password", controllers.ChangePassword)
	}

	// Admin-only routes
	adminGroup := router.Group("/admin")
	{
		adminGroup.Use(middlewares.Authorizes())
		adminGroup.GET("/patients", controllers.GetPatients)
		adminGroup.GET("/admins", controllers.GetAdmins)
	}
}
