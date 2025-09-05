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

	CategoryID uint
	Category Category
}

type Category struct{
	gorm.Model
	NameCategory string
}



type Promotion struct{
	gorm.Model
	NamePromotion string

	ServiceID uint
	Service Service

	PromotionDetail string
	Cost int
	
	DateStart time.Time
	DateEnd time.Time

}
