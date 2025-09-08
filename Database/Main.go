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
		router.GET("/dentistmanagement_controller", controllers.GetAllDentistManagement)
		router.GET("/dentistmanagement_controller/:id", controllers.GetDentistManagementByID)
		router.POST("/dentistmanagement_controller", controllers.CreateDentistManagement)
		router.PUT("/dentistmanagement_controller/:id", controllers.UpdateDentistManagement)
		router.DELETE("/dentistmanagement_controller/:id", controllers.DeleteDentistManagement)

		// Service
		router.GET("/Service_controller", controllers.GetServiceByCategory) // GET /api/service_controller?category_id=1
		router.POST("/Service_controller", controllers.CreateService)       // POST /api/service_controller
		router.PUT("/Service_controller/:id", controllers.UpdateService)    // PUT /api/service_controller/1
		router.DELETE("/Service_controller/:id", controllers.DeleteService) // DELETE /api/service_controller/1

		// Category
		router.GET("/category_controller", controllers.ListCategories)        // GET /api/category_controller
		router.POST("/category_controller", controllers.CreateCategory)       // POST /api/category_controller
		router.PUT("/category_controller/:id", controllers.UpdateCategory)    // PUT /api/category_controller/1
		router.DELETE("/category_controller/:id", controllers.DeleteCategory) // DELETE /api/category_controller/1

		// Promotion
		router.GET("/promotion_controller", controllers.ListPromotions)         // GET /api/promotion_controller
		router.POST("/promotion_controller", controllers.CreatePromotion)       // POST /api/promotion_controller
		router.PUT("/promotion_controller/:id", controllers.UpdatePromotion)    // PUT /api/promotion_controller/1
		router.DELETE("/promotion_controller/:id", controllers.DeletePromotion) // DELETE /api/promotion_controller/1
		
	}

	migrateAll()

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

	// ตาราง DentistManagement
	must(configs.DB.AutoMigrate(
		&entity.DentistManagement{},
	))

	// ตาราง Service และ Category และ promotion
	must(configs.DB.AutoMigrate(
		&entity.Category{},
		&entity.Service{},
		&entity.Promotion{},
	))

	// เพิ่ม mock data สำหรับ DentistManagement ถ้ายังว่าง
	var count int64
	configs.DB.Model(&entity.DentistManagement{}).Count(&count)
	if count == 0 {
		mockData := controllers.GetMockDentists()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock DentistManagement data")
	} else {
		log.Println("⚡ DentistManagement table already has data")
	}

	// เพิ่ม mock data สำหรับ Category
	var countCategory int64
	configs.DB.Model(&entity.Category{}).Count(&countCategory)
	if countCategory == 0 {
		mockData := controllers.GetMockCategories()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock Category data")
	} else {
		log.Println("⚡ Category table already has data")
	}

	// เพิ่ม mock data สำหรับ Service
	var countService int64
	configs.DB.Model(&entity.Service{}).Count(&countService)
	if countService == 0 {
		mockData := controllers.GetMockServices()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock Service data")
	} else {
		log.Println("⚡ Category table already has data")
	}

	// เพิ่ม mock data สำหรับ Promotion ถ้ายังว่าง
	var countPromotion int64
	configs.DB.Model(&entity.Promotion{}).Count(&countPromotion)
	if countPromotion == 0 {
		mockData := controllers.GetMockPromotions()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock Promotion data")
	} else {
		log.Println("⚡ Ppromotion table already has data")
	}

	// เพิ่ม mock data สำหรับ Supplies ถ้ายังว่าง
	configs.DB.Model(&entity.Supply{}).Count(&count)
	if count == 0 {
		mockData := controllers.GetMockSupplies()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock Supply data")
	} else {
		log.Println("⚡ Supply table already has data")
	}

	// เพิ่ม mock data สำหรับ Appointments ถ้ายังว่าง
	configs.DB.Model(&entity.Appointment{}).Count(&count)
	if count == 0 {
		mockData := controllers.GetMockAppointments()
		for _, d := range mockData {
			configs.DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}

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
