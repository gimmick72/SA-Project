package entity

import (
	"time"
	"gorm.io/gorm"
)

type Supply struct{
	gorm.Model
	SupplyName string
	Type string
	unit string
	Quantity int

	CaseDataID uint
	CaseData CaseData 
}

type RecordSupple struct{
	gorm.Model
	DateRecord time.Time

	SupplyID uint
	Supply Supply 
}