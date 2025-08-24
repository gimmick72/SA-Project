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

	// AutoMigrate เฉพาะส่วนเวชภัณฑ์
	migrateAll()

	r := gin.Default()
	r.Use(simpleCORS())

	// health check
	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	api := r.Group("/api")
	{
		// ---------- Supplies API ----------
		api.GET("/supplies", controllers.ListSupplies)   // ค้นหา/กรอง/แบ่งหน้า/เรียง
		api.POST("/supplies", controllers.CreateSupply) //เพิ่มข้อมูล
		api.DELETE("/supplies/:id", controllers.DeleteSupply) // ✅ เรียกจาก controllers
		api.POST("/dispenses", controllers.CreateDispense) //เบิกจ่าย
		api.GET("/dispenses", controllers.ListDispenses)//รายงานการเบิกจ่าย
		// TODO: เพิ่ม POST/PUT สำหรับสร้าง/แก้ไข หากต้องการ
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
		&entity.RecordSupply{}, // ✅ ชื่อ struct ตรงกับ entity
	))
	must(configs.DB.AutoMigrate(&entity.RecordSupply{}))


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
