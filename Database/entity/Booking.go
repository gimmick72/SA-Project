package entity

import (
	"time"
)

// สถานะที่นับเป็นการใช้คิว = reserved, checked_in, done (ไม่นับ cancelled)
type Booking struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Phone     string    `json:"phone"`
	Date      time.Time `json:"date"`
	HHMM      string    `json:"hhmm"`
	Segment   string    `json:"segment"`
	SlotID    uint      `json:"slotId"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	ServiceID *uint `json:"serviceId,omitempty"`
  }