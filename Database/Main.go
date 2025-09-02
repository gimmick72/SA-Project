// main.go
package main

import (
	"log"
	"os"

	"Database/configs"
	"Database/controllers"
	"Database/entity"

	"github.com/gin-gonic/gin"
)

func main() {
	configs.ConnectDatabase()
	migrateAll()

	r := gin.Default()
	r.Use(simpleCORS())

	// health check
	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	api := r.Group("/api")
	{
		// Supplies
		api.GET("/supplies", controllers.ListSupplies)
		api.POST("/supplies", controllers.CreateSupply)
		api.DELETE("/supplies/:id", controllers.DeleteSupply)
		api.POST("/dispenses", controllers.CreateDispense)
		api.GET("/dispenses", controllers.ListDispenses)

		// Schedule / Queue
		api.GET("/schedule", controllers.GetSchedule)
		api.POST("/schedule/assign", controllers.AssignSchedule)

		// 🔧 FIX: อย่าเขียน /api ซ้ำ
		api.GET("/patients", controllers.GetPatients)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("server running on :" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

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
