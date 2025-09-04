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

	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("/api")
	{
		// // AddPatient routes
		router.POST("/patients", controllers.CreatePatient)
		router.GET("/patients", controllers.GetPatient)
		// Patients
		// router.POST("/patients", controllers.CreatePatient)     // สร้าง
		// router.GET("/patients", controllers.GetPatient)         // ดึงทั้งหมด
		// router.GET("/patients/:id", controllers.GetPatientByID) // (เพิ่ม) ดึงรายตัว
		// // router.PUT("/patients/:id", controllers.UpdatePatient)  // (เพิ่ม) แก้ไข
		// router.DELETE("/patients/:id", controllers.DeletePatient) // (เพิ่ม) ลบ

		if err := r.Run(":" + PORT); err != nil {
			panic(err)
		}
	}

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
