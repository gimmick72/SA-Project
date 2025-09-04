// Database/Main.go
package main

import (

	"Database/controllers"
	"Database/configs"
	"github.com/gin-gonic/gin"

)

func main() {
// 1️⃣ เชื่อมต่อฐานข้อมูล
	configs.ConnectionDB() 

	// 2️⃣ Seed staff data
	configs.SetupDatabase()  

	// 3️⃣ เริ่ม Gin
	r := gin.Default()

	// 4️⃣ Middleware CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 5️⃣ Register routes
	r.GET("/staff", controllers.GetAllStaff)
	r.GET("/staff/:id", controllers.GetStaffByID)
	r.PUT("/staff/:id", controllers.UpdateStaff)
	r.POST("/staff", controllers.AddStaff)
	r.DELETE("/staff/:id", controllers.DeleteStaff) 
	r.Run(":8080")

}
