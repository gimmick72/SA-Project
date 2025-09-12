package entity

import (
	"time"

	"gorm.io/gorm"
)


type Supply struct {
  gorm.Model
  Code       string    `json:"code"`
  Name       string    `json:"name"`
  Category   string    `json:"category"`
  Quantity   int       `json:"quantity"`
  Unit       string    `json:"unit"`
  ImportDate time.Time `json:"importDate"`
  ExpiryDate time.Time `json:"expiryDate"`
}


type RecordSupple struct {
	gorm.Model
	DateRecord time.Time

	SupplyID uint
	Supply   Supply `gorm:"foreignKey:SupplyID"` // ระบุ foreignKey ชัดเจน
}
