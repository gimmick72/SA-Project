package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/controllers"
	"Database/entity"
)

const PORT = "8080"

func main() {
	configs.ConnectDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("/api")
	{
		//Patient
		router.POST("/patient", controllers.CreatePatient)
		router.GET("/patient", controllers.GetPatient)

		// Supplies
		router.GET("/supplies", controllers.ListSupplies)
		router.POST("/supplies", controllers.CreateSupply)
		router.DELETE("/supplies/:id", controllers.DeleteSupply)
		router.POST("/dispenses", controllers.CreateDispense)
		router.GET("/dispenses", controllers.ListDispenses)
		router.PUT("/supplies/:id", controllers.UpdateSupply)

		// Schedule / Queue
		router.GET("/schedule", controllers.GetSchedule)
		router.POST("/schedule/assign", controllers.AssignSchedule)

		//DentisMenagement
		router.GET("/dentistmanagement", controllers.GetAllDentistMenagement)
		router.GET("/dentistmanagement/:id", controllers.GetDentistMenagementByID)
		router.POST("/dentistmanagement", controllers.CreateDentistMenagement)
		router.PUT("/dentistmanagement/:id", controllers.UpdateDentistMenagement)
		router.DELETE("/dentistmanagement/:id", controllers.DeleteDentistMenagement)

		// Service 
		router.GET("/services", controllers.ListServices)
		router.POST("/services", controllers.CreateService)
		router.PUT("/services/:id", controllers.UpdateService)
		router.DELETE("/services/:id", controllers.DeleteService)

		// Category 
		router.GET("/categories", controllers.ListCategories)
		router.POST("/categories", controllers.CreateCategory)

		// Promotion 
		router.GET("/promotions", controllers.ListPromotions)
		router.POST("/promotions", controllers.CreatePromotion)
		router.PUT("/promotions/:id", controllers.UpdatePromotion)
		router.DELETE("/promotions/:id", controllers.DeletePromotion)

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

// ฟอร์ด
// -----------------------------------------------------------
// AutoMigrate
// -----------------------------------------------------------
func migrateAll() {
	// เวชภัณฑ์
	must(configs.DB.AutoMigrate(
		&entity.Supply{},
		&entity.RecordSupply{},
	))

	// ตารางคิว
	must(configs.DB.AutoMigrate(
		&entity.Appointment{},
	))

	// (ตัวเลือก) ถ้าจะใช้ตารางผู้ป่วยจริงด้านล่างนี้ ให้เปิดคอมเมนต์
	// must(configs.DB.AutoMigrate(&entity.Patient{}, &entity.ContactPerson{}, &entity.Address{}, &entity.InitialSymptomps{}, &entity.HistoryPatien{}))

	log.Println("✅ AutoMigrate done")
}

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// -----------------------------------------------------------
// Middlewares
// -----------------------------------------------------------
func simpleCORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
