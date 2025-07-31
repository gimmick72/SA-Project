package entity
import ("gorm.io/gorm")

type Service struct{
	gorm.Model
	NameService string
	DetailService string
	Cost float32
}