package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/controllers"
	// "Database/entity"
)

const PORT = "8080"

func main() {
	configs.ConnectDatabase()
	configs.SetupDatbase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	router := r.Group("/api")
	{
		//Patient
		router.POST("/patient", controllers.CreatePatient)
		router.GET("/patient", controllers.GetPatient)
	}

	// Run the server
	if err := r.Run(":" + PORT); err != nil {
		log.Fatal(err)
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
  