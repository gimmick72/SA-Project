package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/controllers"
	"Database/middlewares"
	// "Database/entity"
)

const PORT = "8080"

func main() {
	configs.ConnectDatabase()
	configs.SetupDatbase()

	// Initialize controllers
	paymentController := controllers.NewPaymentController(configs.DB())
	attendanceController := controllers.NewAttendanceController()
	authController := &controllers.AuthController{}

	r := gin.Default()
	r.Use(CORSMiddleware())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true, "message": "Server is running"})
	})

	router := r.Group("/api")
	{
		// Patient routes
		router.POST("/patient", controllers.CreatePatient)
		router.GET("/patient", controllers.GetPatient)

		// Payment routes
		payments := router.Group("/payments")
		{
			payments.POST("", paymentController.ProcessPayment)
			payments.GET("", paymentController.ListTransactions)
			payments.GET("/:id", paymentController.GetTransaction)
			payments.PUT("/:id/status", paymentController.UpdateTransactionStatus)
			payments.GET("/stats", paymentController.GetPaymentStats)
		}

		// Receipt routes
		receipts := router.Group("/receipts")
		{
			receipts.POST("", paymentController.GenerateReceipt)
			receipts.GET("", paymentController.ListReceipts)
			receipts.GET("/:id", paymentController.GetReceipt)
			receipts.PUT("/:id/cancel", paymentController.CancelReceipt)
		}

		// Authentication routes (public)
		auth := router.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
			auth.POST("/logout", authController.Logout)
		}

		// Protected routes (require authentication)
		protected := router.Group("/")
		protected.Use(middlewares.Authorizes())
		{
			// User profile routes
			protected.GET("/profile", authController.GetProfile)
			protected.PUT("/profile", authController.UpdateProfile)

			// Admin-only routes
			adminRoutes := protected.Group("/admin")
			adminRoutes.Use(middlewares.RequireAdmin())
			{
				adminRoutes.GET("/patients", authController.GetPatients)
				adminRoutes.GET("/admins", authController.GetAdmins)
			}

			// Patient routes (patients can access their own data)
			patientRoutes := protected.Group("/patient")
			patientRoutes.Use(middlewares.RequirePatient())
			{
				// Patient-specific endpoints can be added here
			}
		}

		// Attendance routes (admin only)
		attendance := router.Group("/attendance")
		attendance.Use(middlewares.Authorizes(), middlewares.RequireAdmin())
		{
			attendance.POST("", attendanceController.CreateAttendance)
			attendance.GET("", attendanceController.GetAttendanceList)
			attendance.GET("/:id", attendanceController.GetAttendanceByID)
			attendance.PUT("/:id", attendanceController.UpdateAttendance)
			attendance.DELETE("/:id", attendanceController.DeleteAttendance)
			attendance.GET("/stats", attendanceController.GetAttendanceStats)
			attendance.POST("/:action", attendanceController.CheckInOut) // /checkin or /checkout
		}
	}

	// Run the server
	if err := r.Run(":" + PORT); err != nil {
		log.Fatal(err)
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5174")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
