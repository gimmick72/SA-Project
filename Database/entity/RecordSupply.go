
package entity

import (
	"time"
	"gorm.io/gorm"
)

type RecordSupply struct {
	gorm.Model
	Action     string    `json:"action"` // "DISPENSE" (เผื่ออนาคตจะมี "RECEIVE")
	SupplyID   uint      `json:"supply_id"`
	Quantity   int       `json:"quantity"`    // จำนวนที่เบิก (จำนวนบวก)
	CaseCode   string    `json:"case_code"`   // รหัสเคส
	Dispenser  string    `json:"dispenser"`   // ผู้เบิก/หน่วยงาน
	RecordedAt time.Time `json:"recorded_at"` // เวลาเบิก
}
