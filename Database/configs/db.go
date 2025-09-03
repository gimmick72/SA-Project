package configs

import (
	patientEntity "Database/entity/patient"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// DB คือ global database connection
var DB *gorm.DB

// main.go หรือ configs/db.go

// ConnectDatabase เชื่อมต่อฐานข้อมูล SQLite และเก็บ instance ไว้ที่ DB
func ConnectDatabase() {
	var err error
	dsn := "DatabaseProject_SA.db?_pragma=foreign_keys(1)" // ใช้ไฟล์เดียวกับ main.go
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}
	log.Println("✅ Connected to SQLite database")
}

func SetupDatbase() {

	//Migrate the schema
	DB.AutoMigrate(
		//Patient
		&patientEntity.Patient{},
		&patientEntity.Address{},
		&patientEntity.ContactPerson{},
		&patientEntity.HistoryPatien{},
		&patientEntity.InitialSymptomps{},
	)
}
