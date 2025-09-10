package entity

import (
	"time"

	"gorm.io/gorm"
)

// Member
type Member struct {
	gorm.Model
	MemberFirstName string `gorm:"size:100;not null" json:"member_first_name"`
	MemberLastName  string `gorm:"size:100;not null" json:"member_last_name"`

	PhoneNumber string `gorm:"size:30;uniqueIndex" json:"phone_number"`
	Email       string `gorm:"size:120;uniqueIndex" json:"email"`

	Username     string `gorm:"size:60;uniqueIndex;not null" json:"username"`
	PasswordHash string `gorm:"size:255;not null" json:"-"` // ไม่ serialize ออกไป

	// ความสัมพันธ์
	MemberRoles []MemberRole `json:"member_roles"`
}

type Role struct {
	gorm.Model
	RoleName string `gorm:"size:60;uniqueIndex;not null" json:"role_name"`
}

type MemberRole struct {
	gorm.Model

	MemberID uint   `json:"member_id"`
	Member   Member `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"member"`

	RoleID uint `json:"role_id"`
	Role   Role `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"role"`
}

// helper: แปลงเวลาเป็น string ได้สะดวก
type TimeJSON struct {
	time.Time
}

func (t TimeJSON) MarshalJSON() ([]byte, error) {
	if t.Time.IsZero() {
		return []byte(`""`), nil
	}
	return []byte(`"` + t.Time.Format(time.RFC3339) + `"`), nil
}