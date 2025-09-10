package configs

import (
	"Database/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDatabase เชื่อมต่อฐานข้อมูล SQLite และเก็บ instance ไว้ที่ DB

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("DatabaseProject_SA.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	DB = database
}

func SetupDatbase() {

	//Migrate the schema
	DB.AutoMigrate(
		//Patient
		&entity.Patient{},
		&entity.Address{},
		&entity.ContactPerson{},
		&entity.HistoryPatient{},
		&entity.InitialSymptomps{},

		//service
		&entity.Service{},

		//CaseData
		&entity.CaseData{},
		&entity.Treatment{},

		//BookingQueue
		&entity.QueueSlot{},
		&entity.Booking{},

		//Medicine
		&entity.Supply{},
		&entity.RecordSupply{},

		//Queue and Room
		&entity.Appointment{},
	)
}
