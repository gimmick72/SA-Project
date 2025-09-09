package main

import (
    "github.com/gin-gonic/gin"

    "Database/configs"

	"Database/controllers"
)

const PORT = "8080"

func main() {
	configs.ConnectionDB()
	configs.SetupDatbase()
	configs.MockData()

	r := gin.Default()
	r.Use(CORSMiddleware())

	//api OK
	router := r.Group("/api")
	{
		//Patient
		router.POST("/patients", controllers.CreatePatient)     // AddPatient
		router.GET("/patients", controllers.FindPatient)         // ดึงทั้งหมด
		router.GET("/patients/:id", controllers.GetPatientByID) // (เพิ่ม) ดึงรายตัว
		router.PUT("/patients/:id", controllers.UpdatePatient)  // (เพิ่ม) แก้ไข
		router.DELETE("/patients/:id", controllers.DeletePatient) // (เพิ่ม) ลบ

		router.POST("/patients/:id/symptoms",controllers.CreateSymptom) //AddSymptom
		router.GET("/services",controllers.GetServicetoSymtompOption) //ดึง service มาเลือกตอนเพิ่มอาการ
		router.GET("/case-data/:id",controllers.GetCaseHistory) //ดึง case data

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
	// Run the server go run main.go
	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "" {
			origin = "*" // ถ้า dev local
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Vary", "Origin")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

