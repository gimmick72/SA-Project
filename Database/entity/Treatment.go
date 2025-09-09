// Database/entity/Treatment.go
package entity

import (
	"gorm.io/gorm"
)
type Treatment struct {
	gorm.Model
	
	TreatmentName  string
	Price          float64 `gorm:"type:decimal(10,2)"`	

	CaseID     uint     `json:"case_id" gorm:"index"`
	CaseData   CaseData `json:"case_data" gorm:"foreignKey:CaseID;references:ID"`

}