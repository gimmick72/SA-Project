// Database/entity/Treatment.go
package entity

import (
	"gorm.io/gorm"
)
type Treatment struct {
	gorm.Model
	
	TreatmentName  string
	Price          float64 `gorm:"type:decimal(10,2)"`

	// Photo []byte `gorm:"type:blob"`
	// QuadrantID uint
	Quadrants []Quadrant `gorm:"foreignKey:TreatmentID"`
	
	CaseDataID     uint
	CaseData	   CaseData `gorm:"foreignKey:CaseDataID"`		

	
}