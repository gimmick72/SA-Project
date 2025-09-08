package entity

import (
	"time"
)

type Service struct{
	ID      uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NameService string  `json:"name_service"`
	DetailService string  `json:"detail_service`
	Cost float32  `json:"cost"`

	CategoryID uint `json:"category_id"`
	Category Category
}

type Category struct{
	ID      uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NameCategory string `json:"name_category"`
}


type Promotion struct{
	ID      uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NamePromotion string  `json:"name_promotion"`

	ServiceID uint  `json:"service_id"`
	Service Service

	PromotionDetail string  `json:"promotion_detail"`
	Cost float32  `json:"cost"`
	
	DateStart time.Time  `json:"date_start"`
	DateEnd time.Time  `json:"date_end"`

}
