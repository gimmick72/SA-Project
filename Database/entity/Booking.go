// entity/booking.go
package entity

import "time"

type Booking struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	PhoneNumber string    `json:"phone_number" gorm:"size:32;index"`

	ServiceID uint    `json:"service_id"`
	Service   Service `json:"service" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`

	// ⬇⬇⬇ เพิ่มฟิลด์นี้ (ให้ตรงกับคอลัมน์ slot_id NOT NULL)
	SlotID uint `json:"slot_id" gorm:"not null;index"`
	// ถ้าต้องการ relation ด้วย:
	// Slot   QueueSlot `json:"-" gorm:"foreignKey:SlotID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`

	Date    time.Time `json:"date" gorm:"type:date;index"`
	HHMM    string    `json:"hhmm" gorm:"size:4;index"`
	Segment string    `json:"segment" gorm:"size:16;index"`
	Status  string    `json:"status" gorm:"size:16;default:confirmed"`
}
