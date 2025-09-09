package configs

import (
	"Database/entity"
	patientEntity "Database/entity/patient"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"

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

		//CaseData
		&entity.CaseData{},
		&entity.Treatment{},

		// เวชภัณฑ์
		&entity.Supply{},

		// ตารางคิว
		&entity.Appointment{},

		// ตาราง DentistManagement
		&entity.DentistManagement{},
		

		// ตาราง Service และ Category และ promotion
		&entity.Category{},
		&entity.Service{},
		&entity.Promotion{},
	)
}


// จำลองข้อมูล
func MockData() {

	// เพิ่ม mock data สำหรับ DentistManagement ถ้ายังว่าง
	var count int64
	DB.Model(&entity.DentistManagement{}).Count(&count)
	if count == 0 {
		mockData := GetMockDentists()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock DentistManagement data")
	} else {
		log.Println("⚡ DentistManagement table already has data")
	}

	// เพิ่ม mock data สำหรับ Category
	var countCategory int64
	DB.Model(&entity.Category{}).Count(&countCategory)
	if countCategory == 0 {
		mockData := GetMockCategories()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Category data")
	} else {
		log.Println("⚡ Category table already has data")
	}

	// เพิ่ม mock data สำหรับ Service
	var countService int64
	DB.Model(&entity.Service{}).Count(&countService)
	if countService == 0 {
		mockData := GetMockServices()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Service data")
	} else {
		log.Println("⚡ Category table already has data")
	}

	// เพิ่ม mock data สำหรับ Promotion ถ้ายังว่าง
	var countPromotion int64
	DB.Model(&entity.Promotion{}).Count(&countPromotion)
	if countPromotion == 0 {
		mockData := GetMockPromotions()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Promotion data")
	} else {
		log.Println("⚡ Ppromotion table already has data")
	}

	// เพิ่ม mock data สำหรับ Supplies ถ้ายังว่าง
	DB.Model(&entity.Supply{}).Count(&count)
	if count == 0 {
		mockData := GetMockSupplies()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Supply data")
	} else {
		log.Println("⚡ Supply table already has data")
	}

	// เพิ่ม mock data สำหรับ Appointments ถ้ายังว่าง
	DB.Model(&entity.Appointment{}).Count(&count)
	if count == 0 {
		mockData := GetMockAppointments()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}

}
