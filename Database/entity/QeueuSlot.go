// entity/queue_slot.go
package entity

import (
	"time"

	"gorm.io/gorm"
)

type QueueSlot struct {
	gorm.Model
	Date     time.Time `json:"date" gorm:"type:date;not null;index;uniqueIndex:uq_slot"`
	HHMM     string    `json:"hhmm" gorm:"size:4;not null;uniqueIndex:uq_slot"`
	Segment  string    `json:"segment" gorm:"size:16;not null;index;uniqueIndex:uq_slot"` // "morning|afternoon|evening"
	Capacity int       `json:"capacity" gorm:"not null"`
	Used     int       `json:"used" gorm:"not null;default:0"`
}
