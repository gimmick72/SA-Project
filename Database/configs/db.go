// Database/configs/db.go
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
    err := db.AutoMigrate(
        &entity.PersonalData{},	
        &entity.Department{},
        &entity.Patient{},
		&entity.Address{},
		&entity.ContactPerson{},
		&entity.InitialSymptomps{},
		&entity.Treatment{},
		&entity.Quadrant{},
		&entity.CaseData{},
		// &entity.Service{},
		// &entity.HistoryPatient{},
    )
    if err != nil {
        log.Fatalf("❌ Failed to migrate database: %v", err)
    }

    // seed ข้อมูลเริ่มต้น
    
	SeedPatient()
	SeedCase()
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

// ------------------- SEED PATIENT -------------------
func SeedPatient() {
	var count int64
	db.Model(&entity.Patient{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Patients already seeded, skipping...")
		return
	}

	patients := []entity.Patient{
		{
			CitizenID:        "1234567890123",
			Prefix:           "นาย",
			FirstName:        "เทส",
			LastName:         "ระบบ",
			NickName:         "ชาย",
			Enthnicity:       "ไทย",
			Nationality:      "ไทย",
			CongenitaDisease: "ไม่มี",
			BloodType:        "O",
			Gender:           "ชาย",
			BirthDay:         time.Date(1990, 5, 12, 0, 0, 0, 0, time.UTC),
			PhoneNumber:      "0812345678",
			Age:              35,
			DrugAllergy:      "ไม่มี",
			Address: []entity.Address{
				{HouseNumber: "123", Moo: "1", Subdistrict: "ในเมือง", District: "เมือง", Provice: "ขอนแก่น", Postcod: "40000"},
			},
			ContactPerson: []entity.ContactPerson{
				{Relationship: "บิดา", ContactperPhone: "0811111111"},
			},
			InitialSymptomps: []entity.InitialSymptomps{
				{Symptomps: "ปวดฟันกรามขวา", BloodPressure: "120/80", Visit: time.Now(), HeartRate: "72", Weight: 65.0, Height: 170.0},
			},
		},
		{
			CitizenID:        "9876543210987",
			Prefix:           "นางสาว",
			FirstName:        "สุดา",
			LastName:         "พิมพ์ดี",
			NickName:         "ดาว",
			Enthnicity:       "ไทย",
			Nationality:      "ไทย",
			CongenitaDisease: "หอบหืด",
			BloodType:        "A",
			Gender:           "หญิง",
			BirthDay:         time.Date(1985, 8, 20, 0, 0, 0, 0, time.UTC),
			PhoneNumber:      "0891112222",
			Age:              40,
			DrugAllergy:      "Penicillin",
			Address: []entity.Address{
				{HouseNumber: "456", Moo: "2", Subdistrict: "ลาดพร้าว", District: "บางกะปิ", Provice: "กรุงเทพฯ", Postcod: "10240"},
			},
			ContactPerson: []entity.ContactPerson{
				{Relationship: "มารดา", ContactperPhone: "0822222222"},
			},
			InitialSymptomps: []entity.InitialSymptomps{
				{Symptomps: "เหงือกบวม", BloodPressure: "118/76", Visit: time.Now(), HeartRate: "75", Weight: 55.0, Height: 160.0},
			},
		},
	}

	for _, p := range patients {
		if err := db.Create(&p).Error; err != nil {
			log.Printf("❌ Failed to seed patient %s: %v", p.FirstName, err)
		}
	}

	log.Println("✅ Seeded patients successfully!")
}

// ------------------- SEED CASE -------------------
func SeedCase() {
	
	var count int64
	db.Model(&entity.CaseData{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Cases already seeded, skipping...")
		return
	}

	// ดึงผู้ป่วยที่มีอยู่แล้วมาใช้
	var patient entity.Patient
	if err := db.First(&patient).Error; err != nil {
		log.Println("❌ Cannot seed cases because no patient exists")
		return
	}

	// สร้างเคสใหม่
	case1 := entity.CaseData{
		SignDate:      time.Now(),
		Appointment_date: time.Date(2072, 8, 20, 0, 0, 0, 0, time.UTC),
		Note:         "ตรวจสุขภาพฟันประจำปี",
		TotalPrice:    3500,
		PatientID:    patient.ID,
		DepartmentID: 1, // สมมติว่ามี Department ID = 1

		Treatment: []entity.Treatment{
			{	
				TreatmentName: "ขูดหินปูน",
				Price:         1500,
				Quadrants: []entity.Quadrant{
					{Quadrant: "ขวาบน ซี่ 11"},
					{Quadrant: "ซ้ายล่าง ซี่ 36"},
				},
				// Photo: []byte{100, 100, 78, 71, 13, 10, 26, 10},
			},
			{
				TreatmentName: "อุดฟัน",
				Price:         2000,
				Quadrants: []entity.Quadrant{
					{Quadrant: "ขวาบนซี่ 26"},
				},
				// Photo: []byte{137, 80, 78, 71, 13, 10, 26, 10},
			},
		},
	}

	db.Create(&case1)

	log.Println("✅ Seeded case (CaseData + Treatment + Quadrant) successfully!")
}