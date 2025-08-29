package entity

import (
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	MemberFirstName string
	MemberLastName  string
	PhoneNumber     string
	Email           string
}

type Role struct {
	gorm.Model
	RoleName string
}

type MemberRole struct {
	gorm.Model

	MemberId uint
	Member   Member `gorm:"foreignKey:MemberId;references:ID"`

	RoleID uint
	Role   Role `gorm:"foreignKey:RoleID;references:ID"`
}

