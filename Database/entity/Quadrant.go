// Database/entity/Quadrant.go
package entity

import (

	"gorm.io/gorm"
)
type Quadrant struct {
	gorm.Model
	Quadrant  		string
	
	TreatmentID uint     
	Treatment   Treatment  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	
}