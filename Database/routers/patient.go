package routers

import (
	ControlerInitailPatient "Database/controllers/initailPatient"
	"github.com/gin-gonic/gin"

)

func PatientRouter(router *gin.RouterGroup) {
	router.POST("/patients", ControlerInitailPatient.CreatePatient)       // AddPatient
	router.GET("/patients", ControlerInitailPatient.FindPatient)          // ดึงทั้งหมด
	router.GET("/patients/:id", ControlerInitailPatient.GetPatientByID)   // (เพิ่ม) ดึงรายตัว
	router.PUT("/patients/:id", ControlerInitailPatient.UpdatePatient)    // (เพิ่ม) แก้ไข
	router.DELETE("/patients/:id", ControlerInitailPatient.DeletePatient) // (เพิ่ม) ลบ

	router.POST("/patients/:id/symptoms", ControlerInitailPatient.CreateSymptom) //AddSymptom
	router.GET("/services", ControlerInitailPatient.GetServicetoSymtompOption)   //ดึง service มาเลือกตอนเพิ่มอาการ
	router.GET("/case-data/:id", ControlerInitailPatient.GetCaseHistory)         //ดึง case data
	
}
