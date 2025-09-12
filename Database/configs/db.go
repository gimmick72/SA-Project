// Database/configs/db.go
package configs

import (
	"Database/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"time"
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

		// เวชภัณฑ์
		&entity.Supply{},
		&entity.RecordSupply{},

		// //Queue and Room
		&entity.Appointment{},

		// ตาราง DentistManagement
		&entity.DentistManagement{},

		// ตาราง Service และ Category และ promotion
		&entity.Category{},
		&entity.Service{},
		&entity.Promotion{},

		// ตารารางระบบ Personal and Treatment
		&entity.PersonalData{},
		&entity.Department{},

		// &entity.Patient{},
		&entity.Address{},
		&entity.ContactPerson{},
		&entity.InitialSymptomps{},
		&entity.Treatment{},
		&entity.Quadrant{},
		&entity.CaseData{},

		//BookingQueue
		&entity.QueueSlot{},
		&entity.Booking{},
	)

	// จำลองข้อมูล ระบบ -> ตารางแพทย์, บริการ, อุปกรณ์, คิวห้อง
	MockData()
	// seed ข้อมูลเริ่มต้น ระบบ Personal and Treatment
	SeedPatient()
	SeedCase()
	SeedStaff()
	SeedAddress()
	SeedContactPerson()
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

	
	// เพิ่ม mock data สำหรับ Booking  ถ้ายังว่าง
	DB.Model(&entity.Booking{}).Count(&count)
	if count == 0 {
		mockData := GetMockbooking()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}

	
	// เพิ่ม mock data สำหรับ Booking  ถ้ายังว่าง
	DB.Model(&entity.QueueSlot{}).Count(&count)
	if count == 0 {
		mockData := GetMockQueueSlots()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}


	// GetMockQueueSlots()
}

// ------------------- SEED STAFF (PersonalData + Department) -------------------
func SeedStaff() {
	// ถ้ามีข้อมูลแล้วข้าม
	var count int64
	DB.Model(&entity.PersonalData{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Staff already seeded, skipping...")
		return
	}

	staffList := []struct {
		Title, FirstName, LastName, Gender, Email, EmpNationalID, Tel string
		HouseNumber, Subdistrict, District, VillageNumber             string
		Age                                                           int
		Position, EmpType, License, Specialization                    string
		CompRate                                                      float32

		StartDate time.Time
		Password  string
	}{
		{"ทพ.", "Somsak", "Thongdee", "ชาย", "somsak@clinic.com", "1234567890123", "0812345678",
			"123 Moo 1", "Nongprue", "Muang", "Nakhon Ratchasima", 45,
			"ทันตแพทย์", "Part-time", "D54321", "ทันตกรรมจัดฟัน", 20000,
			time.Date(2015, 3, 1, 0, 0, 0, 0, time.UTC), "123456"},

		{"ทพ.ญ.", "Suda", "Kanya", "หญิง", "suda@clinic.com", "9876543210987", "0891112222",
			"456 Sukhumvit Rd", "", "Bangkok", "", 45,
			"ผู้ช่วย", "Full-time", "A00002", "", 15000,
			time.Date(2021, 9, 10, 0, 0, 0, 0, time.UTC), "223456"},

		{"นาย", "Anan", "Chaiyos", "ชาย", "anan@clinic.com", "1122334455667", "0895551111",
			"88 Rama 2 Rd", "", "Bangkok", "", 45,
			"ผู้จัดการ", "Full-time", "", "", 12000,
			time.Date(2018, 11, 1, 0, 0, 0, 0, time.UTC), "323456"},
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
		DB.Create(&p)

		// สร้าง Department (เชื่อมด้วย PersonalDataID)
		d := entity.Department{
			PersonalDataID: p.ID,
			Position:       s.Position,
			EmpType:        s.EmpType,
			License:        s.License,
			CompRate:       s.CompRate,
			Specialization: s.Specialization,
			StartDate:      s.StartDate,
			Password:       s.Password,
		}
		DB.Create(&d)
	}

	log.Println("✅ Seeded staff (PersonalData + Departments) successfully!")
}

// ------------------- SEED PATIENT -------------------
func SeedPatient() {
	var count int64
	DB.Model(&entity.Patient{}).Count(&count)
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
			CongenitalDisease: "ไม่มี",
			BloodType:        "O",
			Gender:           "ชาย",
			Birthday:         time.Date(1990, 5, 12, 0, 0, 0, 0, time.UTC),
			PhoneNumber:      "0812345678",
			Age:              35,
			DrugAllergy:      "ไม่มี",
			Address: &entity.Address{
				HouseNumber: "123",
				Moo:         "1",
				Subdistrict: "ในเมือง",
				District:    "เมือง",
				Province:    "ขอนแก่น",
				Postcode:    "40000",
			},
			ContactPerson: &entity.ContactPerson{
				Relationship: "บิดา",
				PhoneNumber:  "0811111111",
			},
			InitialSymptomps: []entity.InitialSymptomps{
				{
					Symptomps: "ปวดฟันกรามขวา",
					Systolic:  120,
					Diastolic: 80,
					HeartRate: "72",
					Visit:     time.Now(),
					Weight:    65.0,
					Height:    170.0,
				},
			},
		},
		{
			CitizenID:        "9876543210987",
			Prefix:           "นางสาว",
			FirstName:        "สุดา",
			LastName:         "พิมพ์ดี",
			NickName:         "ดาว",
			CongenitalDisease: "หอบหืด",
			BloodType:        "A",
			Gender:           "หญิง",
			Birthday:         time.Date(1985, 8, 20, 0, 0, 0, 0, time.UTC),
			PhoneNumber:      "0891112222",
			Age:              40,
			DrugAllergy:      "Penicillin",
			Address: &entity.Address{
				HouseNumber: "45",
				Moo:         "3",
				Subdistrict: "ศิลา",
				District:    "เมือง",
				Province:    "ขอนแก่น",
				Postcode:    "40000",
			},
			ContactPerson: &entity.ContactPerson{
				Relationship: "มารดา",
				PhoneNumber:  "0822222222",
			},
			InitialSymptomps: []entity.InitialSymptomps{
				{
					Symptomps: "เหงือกบวม",
					Systolic:  118,
					Diastolic: 76,
					HeartRate: "75",
					Visit:     time.Now(),
					Weight:    55.0,
					Height:    160.0,
				},
			},
		},
	}

	for _, p := range patients {
		if err := DB.Create(&p).Error; err != nil {
			log.Printf("❌ Failed to seed patient %s: %v", p.FirstName, err)
		}
	}

	log.Println("✅ Seeded patients successfully!")
}

// ------------------- SEED CASE -------------------
func SeedCase() {

	var count int64
	DB.Model(&entity.CaseData{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Cases already seeded, skipping...")
		return
	}

	// ดึงผู้ป่วยที่มีอยู่แล้วมาใช้
	var patient entity.Patient
	if err := DB.First(&patient).Error; err != nil {
		log.Println("❌ Cannot seed cases because no patient exists")
		return
	}

	// สร้างเคสใหม่
	case1 := entity.CaseData{
		SignDate:         time.Now(),
		Appointment_date: time.Date(2072, 8, 20, 0, 0, 0, 0, time.UTC),
		Note:             "ตรวจสุขภาพฟันประจำปี",
		TotalPrice:       3500,
		PatientID:        patient.ID,
		DepartmentID:     1, // สมมติว่ามี Department ID = 1

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

	DB.Create(&case1)

	log.Println("✅ Seeded case (CaseData + Treatment + Quadrant) successfully!")
}
