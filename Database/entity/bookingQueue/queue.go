package bookingQueue

import (
	"gorm.io/gorm"
	"time"

	"Database/entity"
	"Database/entity/patient"
)

type Queue struct{
	gorm.Model
	Username string
	QueueBooking time.Time
	
	PatientID uint
	Patient patient.Patient `gorm:"foreignKey:PatientID;references:ID"`
	
	ServiceID uint
	Service entity.Service `gorm:"foreignKey:ServiceID;references:ID"`
	
	TimeslotID uint
	Timerslot Timeslot `gorm:"foreignKey:TimeslotID;references:ID"`
}

