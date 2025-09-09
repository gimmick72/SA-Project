package routers

import (
	"Database/controllers"
	"github.com/gin-gonic/gin"
)

func PatientRouter(router *gin.RouterGroup) {
	router.POST("/patients", controllers.CreatePatient)       // AddPatient
	router.GET("/patients", controllers.FindPatient)          // ดึงทั้งหมด
	router.GET("/patients/:id", controllers.GetPatientByID)   // (เพิ่ม) ดึงรายตัว
	router.PUT("/patients/:id", controllers.UpdatePatient)    // (เพิ่ม) แก้ไข
	router.DELETE("/patients/:id", controllers.DeletePatient) // (เพิ่ม) ลบ

	router.POST("/patients/:id/symptoms", controllers.CreateSymptom) //AddSymptom
	router.GET("/services", controllers.GetServicetoSymtompOption)   //ดึง service มาเลือกตอนเพิ่มอาการ
	router.GET("/case-data/:id", controllers.GetCaseHistory)         //ดึง case data
}
