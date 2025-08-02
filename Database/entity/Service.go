package entity

import (
	"time"
	"gorm.io/gorm"
)

type Service struct{
	gorm.Model
	NameService string
	DetailService string
	Cost float32
}

type Promotion struct{
	gorm.Model
	PromotionDetail string
}

// รวมservive และ promotion
type ServicePromotion struct{
	gorm.Model

	ServiceID uint
	Service Service `gorm:"foreignKey"`

	PromotionID uint
	Promotion Promotion `gorm:"foreignKey"`

	StartDate time.Time
	EndDate time.Time
}