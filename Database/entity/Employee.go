package entity

import "gorm.io/gorm"

// เก็บ role เป็น string ให้ตรงกับหน้าเว็บ: "ทันตแพทย์" | "ผู้ช่วยทันตะ" | "ทันตภิบาล" | "เวชระเบียน" | "คนจ่ายยา"
type Employee struct {
	gorm.Model
	FirstName    string `gorm:"size:100;not null"            json:"first_name"`
	LastName     string `gorm:"size:100;not null"            json:"last_name"`
	Username     string `gorm:"size:60;uniqueIndex;not null" json:"username"`
	PasswordHash string `gorm:"size:255;not null"            json:"-"`           // ไม่ serialize ออก
	Role         string `gorm:"size:40;index;not null"       json:"role"`        // เช่น "ทันตแพทย์"
}
