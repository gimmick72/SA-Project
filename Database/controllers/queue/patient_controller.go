// controllers/patient_controller.go
package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type PatientResp struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"` // "appointment" | "walkin"
	CaseCode    *string `json:"caseCode,omitempty"`
	Note        *string `json:"note,omitempty"`
	DurationMin *int    `json:"durationMin,omitempty"`
}

func GetPatients(c *gin.Context) {
	// TODO: เปลี่ยนเป็น query จาก DB จริงได้ภายหลัง
	data := []PatientResp{
		{ID: "P001", Name: "คุณสมชาย", Type: "appointment"},
		{ID: "P002", Name: "คุณมณี",  Type: "walkin"},
		{ID: "P003", Name: "คุณอิสร์", Type: "appointment"},
		{ID: "P004", Name: "คุณดีดี้", Type: "appointment"},
	}
	c.JSON(http.StatusOK, data)
}
