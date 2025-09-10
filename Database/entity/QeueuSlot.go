package entity

import (
	"time"

	
)

// entity/queue.go
type QueueSlot struct {
	ID       uint      `json:"id" gorm:"primaryKey"`
	Date     time.Time `json:"date" gorm:"not null;index;uniqueIndex:uq_slot"`
	HHMM     string    `json:"hhmm" gorm:"size:4;not null;uniqueIndex:uq_slot"`
	Segment  string    `json:"segment" gorm:"size:16;not null;uniqueIndex:uq_slot"`
	Capacity int       `json:"capacity" gorm:"not null"`
	Used     int       `json:"used" gorm:"not null;default:0"`
  }
