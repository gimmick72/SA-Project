package main

import (
	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/routers"
)

const PORT = "8080"

func main() {
	configs.ConnectionDB()
	configs.SetupDatbase()
	

	r := gin.Default()
	r.Use(CORSMiddleware())

	//api OK
	router := r.Group("/api")
	{
		
		routers.PatientRouter(router) //ระบบ Patient	
		routers.SupplyRouter(router) // ระบบอุปกรณ์	
		routers.Schedule_QueueRouter(router) // ระบบจัดคิวห้อง		
		routers.DentisMenagementRouter(router) // ระบบตารางแพทย์	
		routers.ServiceRouter(router) // ระบบบริการและโปรโมชัน
		routers.CaseDataRouter(router) // ระบบการรักษา
		// routers.CaseData_2_Router(router) // ระบบการรักษา
		routers.StaffRouter(router) // ระบบบุคลากร
		routers.QueueRouter(router) // ระบบจองคิว

		// New API routes
		routers.PaymentRouter(router) // ระบบการชำระเงิน
		routers.AttendanceRouter(router) // ระบบการเข้างาน
		routers.AuthRouter(router) // ระบบการยืนยันตัวตน

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
