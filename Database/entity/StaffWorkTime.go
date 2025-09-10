package entity

import (
	"time"

	"gorm.io/gorm"
)

type Shifts struct {
	gorm.Model
	ShiftsName           string
	StartTime            time.Time
	EndTime              time.Time
	BreakDurationMinutes time.Time
	StandardHours        int
}
type Schedules struct {
    gorm.Model          // จะสร้าง ID, CreatedAt, UpdatedAt, DeletedAt ให้อัตโนมัติ
    SchedulesDate time.Time  // วันเวลาของตารางงาน

    ShiftsID uint        // FK ชี้ไปยัง Shifts
    Shifts   Shifts `gorm:"foreignKey:ShiftsID"`  // ระบุ FK ชัดเจน

    PersonalDataID uint        // FK ชี้ไปยัง PersonalData
    PersonalData PersonalData `gorm:"foreignKey:PersonalDataID"` // ระบุ FK ชัดเจน
}

