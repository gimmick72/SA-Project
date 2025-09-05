package configs

import (
	"Database/entity"
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("DatabaseProject_SA.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database
}

func SetupDatabase() {
	// 1️⃣ Migrate schema
	db.AutoMigrate(
		&entity.PersonalData{},
		&entity.Department{},
	)
	if err := db.AutoMigrate(&entity.PersonalData{}, &entity.Department{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	// 2️⃣ Seed staff data
	 SeedStaff()
}

// ------------------- SEED STAFF (PersonalData + Department) -------------------
func SeedStaff() {
	// ถ้ามีข้อมูลแล้วข้าม
	var count int64
	db.Model(&entity.PersonalData{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Staff already seeded, skipping...")
		return
	}

	staffList := []struct {
		Title, FirstName, LastName, Gender, Email, EmpNationalID, Tel string
		HouseNumber, Subdistrict, District, VillageNumber              string
		Age                                                            int
		Position, EmpType,  License                          string
		CompRate                                                       float32
		Specialization                                                 string
		StartDate                                                      time.Time
	}{
		{"ทพ.", "Somsak", "Thongdee", "ชาย", "somsak@clinic.com", "1234567890123", "081-234-5678",
			"123 Moo 1", "Nongprue", "Muang", "Nakhon Ratchasima", 45,
			"ทันตแพทย์", "Part-time", "D54321", 20000, "ทันตกรรมจัดฟัน",
			time.Date(2015, 3, 1, 0, 0, 0, 0, time.UTC)},

		{"ทพ.ญ.", "Suda", "Kanya", "หญิง", "suda@clinic.com", "9876543210987", "089-111-2222",
			"456 Sukhumvit Rd", "", "Bangkok", "", 45,
			"ผู้ช่วย", "Full-time", "A00002", 15000, "",
			time.Date(2021, 9, 10, 0, 0, 0, 0, time.UTC)},

		{"นาย", "Anan", "Chaiyos", "ชาย", "anan@clinic.com", "1122334455667", "089-555-1111",
			"88 Rama 2 Rd", "", "Bangkok", "", 45,
			"เจ้าหน้าที่แผนกต้อนรับ", "Full-time", "", 12000, "",
			time.Date(2018, 11, 1, 0, 0, 0, 0, time.UTC)},
	}

	for _, s := range staffList {
		// สร้าง PersonalData
		p := entity.PersonalData{
			Title:         s.Title,
			FirstName:     s.FirstName,
			LastName:      s.LastName,
			Gender:        s.Gender,
			Email:         s.Email,
			Age:           s.Age,
			EmpNationalID: s.EmpNationalID,
			Tel:           s.Tel,
			HouseNumber:   s.HouseNumber,
			Subdistrict:   s.Subdistrict,
			District:      s.District,
			VillageNumber: s.VillageNumber,
		}
		db.Create(&p)

		// สร้าง Department (เชื่อมด้วย PersonalDataID)
		d := entity.Department{
			PersonalDataID: p.ID,
			Position:       s.Position,
			EmpType:        s.EmpType,
			License:        s.License,
			CompRate:       s.CompRate,
			Specialization: s.Specialization,
			StartDate:      s.StartDate,
		}
		db.Create(&d)
	}

	log.Println("✅ Seeded staff (PersonalData + Departments) successfully!")
}
