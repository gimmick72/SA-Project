package configs

import (
	"Database/entity"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// db คือ global database connection
var db *gorm.DB

// ConnectDatabase เชื่อมต่อฐานข้อมูล SQLite และเก็บ instance ไว้ที่ db
func ConnectDatabase() {
	var err error
	dsn := "DatabaseProject_SA.db?_pragma=foreign_keys(1)" // ใช้ไฟล์เดียวกับ main.go
	db, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}
	log.Println("✅ Connected to SQLite database")
}

func SetupDatbase() {

	//Migrate the schema
	db.AutoMigrate(
		//Patient
		&entity.Patient{},
		&entity.Address{},
		&entity.ContactPerson{},
		&entity.HistoryPatien{},
		&entity.InitialSymptomps{},
		
		//Payment System
		&entity.Staff{},
		&entity.Payment{},
		&entity.Receipt{},
		
		//Attendance System
		&entity.Attendance{},
		
		//Authentication System
		&entity.User{},
	)
}

// DB returns the database instance
func DB() *gorm.DB {
	return db
}
