package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/controllers"
)

const defaultPort = "8080"

func main() {
	// เชื่อมต่อและตั้งค่า DB (ตามฟังก์ชันที่คุณมีอยู่)
	configs.ConnectDatabase()
	configs.SetupDatbase() // NOTE: ถ้าของจริงสะกด SetupDatabase ให้แก้ชื่อตรงนี้

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("/api")
	{
		// Patient (ของเดิม)
		api.POST("/patient", controllers.CreatePatient)
		api.GET("/patient", controllers.GetPatient)

		// Members (ใหม่)
		api.GET("/members", controllers.ListMembers)
		api.GET("/members/:id", controllers.GetMember)
		api.POST("/members", controllers.CreateMember)
		api.PUT("/members/:id", controllers.UpdateMember)
		api.DELETE("/members/:id", controllers.DeleteMember)

		// Admin - Employees
		api.GET("/employees", controllers.ListEmployees)
		api.GET("/employees/:id", controllers.GetEmployee)
		api.POST("/employees", controllers.CreateEmployee)
		api.PUT("/employees/:id", controllers.UpdateEmployee)
		api.DELETE("/employees/:id", controllers.DeleteEmployee)
	}

	// Run the server
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

// CORS แบบกำหนด Origin ได้หลายค่า + รองรับ env FRONTEND_ORIGIN
func CORSMiddleware() gin.HandlerFunc {
	allowed := map[string]bool{
		"http://localhost:5173": true, // vite default
		"http://localhost:5174": true, // ที่คุณใช้อยู่
	}

	// หากตั้ง FRONTEND_ORIGIN ใน env จะอนุญาตเพิ่มให้อัตโนมัติ
	if v := os.Getenv("FRONTEND_ORIGIN"); v != "" {
		allowed[v] = true
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if allowed[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Vary", "Origin")
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Accept, Origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		// จัดการ preflight
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
