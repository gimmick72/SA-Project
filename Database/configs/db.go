package configs

import (
	patientEntity "Database/entity/patient"
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
		&patientEntity.Patient{},
		&patientEntity.Address{},
		&patientEntity.ContactPerson{},
		&patientEntity.HistoryPatient{},
		&patientEntity.InitialSymptomps{},

		//service
		&entity.Service{},
		
	)
}
