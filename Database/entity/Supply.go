package entity

import (
	"time"

	"gorm.io/gorm"
)

type Supply struct {
	gorm.Model
	SupplyName string
	Type       string
	Unit       string
	Quantity   int

	CaseDataID uint
	CaseData   CaseData `gorm:"foreignKey:CaseDataID"` // ระบุ foreignKey ชัดเจน
}

type RecordSupple struct {
	gorm.Model
	DateRecord time.Time

	SupplyID uint
	Supply   Supply `gorm:"foreignKey:SupplyID"` // ระบุ foreignKey ชัดเจน
}
