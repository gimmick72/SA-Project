package entity

import (
	"time"

	"gorm.io/gorm"
)

// type Supply struct {
// 	gorm.Model
// 	SupplyName string
// 	Type       string
// 	Unit       string
// 	Quantity   int

// 	CaseDataID uint
// 	CaseData   CaseData `gorm:"foreignKey:CaseDataID"` // ระบุ foreignKey ชัดเจน
// }


type Supply struct {
  gorm.Model
  Code       string    `json:"code"`
  Name       string    `json:"name"`
  Category   string    `json:"category"`
  Quantity   int       `json:"quantity"`
  Unit       string    `json:"unit"`
  ImportDate time.Time `json:"importDate"`
  ExpiryDate time.Time `json:"expiryDate"`

	//seDataID uint
	//Casea CaseData `gorm:"foreignKey"`

}


type RecordSupple struct {
	gorm.Model
	DateRecord time.Time

	SupplyID uint
	Supply   Supply `gorm:"foreignKey:SupplyID"` // ระบุ foreignKey ชัดเจน
}
