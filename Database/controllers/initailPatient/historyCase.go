// controllers/historyCase.go
package controllers

import (
	"Database/configs"
	"Database/entity"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

/* ---------- DTO ---------- */

type dentistDTO struct {
	Firstname string `json:"firstname,omitempty"`
	Lastname  string `json:"lastname,omitempty"`
}

type patientDTO struct {
	Firstname string `json:"firstname,omitempty"`
	Lastname  string `json:"lastname,omitempty"`
}

type treatmentDTO struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`  // map จาก treatment_name
	Price float64 `json:"price"` // decimal(10,2) → float64
}

type caseDTO struct {
	ID         uint           `json:"id"`
	VisitDate  string         `json:"visitDate"`
	Diagnosis  string         `json:"diagnosis"`
	TotalCost  float64        `json:"totalCost"`
	Dentist    dentistDTO     `json:"Dentist,omitempty"`
	Patient    patientDTO     `json:"Patient,omitempty"`
	Treatments []treatmentDTO `json:"Treatments,omitempty"`
}

/* ---------- helpers ---------- */

func formatVisitDate(cs entity.CaseData) string {
	const fmt = "2006-01-02 15:04"
	if !cs.SignDate.IsZero() {
		return cs.SignDate.Format(fmt)
	}
	if !cs.Appointment_date.IsZero() {
		return cs.Appointment_date.Format(fmt)
	}
	if !cs.CreatedAt.IsZero() {
		return cs.CreatedAt.Format(fmt)
	}
	return "-"
}

/* ---------- GET /api/case-data/:id (patientID) ---------- */

func GetCaseHistory(c *gin.Context) {
	idStr := c.Param("id")
	pid, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil || pid == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid patient id"})
		return
	}

	var cases []entity.CaseData
	if err := configs.DB.
		Where("patient_id = ?", pid).
		Preload("Patient").
		Preload("Department.PersonalData"). // ชื่อหมอ
		Preload("Treatment").               // รายการหัตถการ
		Order("created_at DESC").
		Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	out := make([]caseDTO, 0, len(cases))

	for _, cs := range cases {
		item := caseDTO{
			ID:        cs.ID,
			VisitDate: formatVisitDate(cs),
			Diagnosis: strings.TrimSpace(cs.Note),
			TotalCost: cs.TotalPrice,
		}

		// ✅ PersonalData เป็น value type → เช็ค zero value ด้วย ID != 0
		if cs.Department.PersonalData.ID != 0 {
			item.Dentist = dentistDTO{
				Firstname: cs.Department.PersonalData.FirstName,
				Lastname:  cs.Department.PersonalData.LastName,
			}
		}

		if cs.Patient.ID != 0 {
			item.Patient = patientDTO{
				Firstname: cs.Patient.FirstName,
				Lastname:  cs.Patient.LastName,
			}
		}

		for _, t := range cs.Treatment {
			item.Treatments = append(item.Treatments, treatmentDTO{
				ID:    t.ID,
				Name:  t.TreatmentName, // column: treatment_name
				Price: t.Price,
			})
		}

		out = append(out, item)
	}

	c.JSON(http.StatusOK, gin.H{"data": out})
}
