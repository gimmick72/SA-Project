package configs

import (
	"Database/entity"
	patientEntity "Database/entity/patient"

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

		// dashboard
		&entity.Status{},

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
		&entity.RecordSupply{},

		// ตารางคิว
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
		&entity.Patient{},
		&entity.Address{},
		&entity.ContactPerson{},
		&entity.InitialSymptomps{},
		&entity.Treatment{},
		&entity.Quadrant{},
		&entity.CaseData{},

		// Payment System
		&entity.Payment{},
		&entity.Receipt{},

		// Attendance System
		&entity.Attendance{},

		// Authentication System
		&entity.User{},
	)

	// จำลองข้อมูล ระบบ -> ตารางแพทย์, บริการ, อุปกรณ์, คิวห้อง
	MockData()
	// seed ข้อมูลเริ่มต้น ระบบ Personal and Treatment
	SeedPatient()
	SeedCase()
	SeedStaff()
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

	// เพิ่ม mock data สำหรับ status intitial ถ้ายังว่าง
	DB.Model(&entity.Status{}).Count(&count)
	if count == 0 {
		mockData := GetMockStatus()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}

	// เพิ่ม mock data สำหรับ InitialSymptomps ถ้ายังว่าง
	DB.Model(&entity.InitialSymptomps{}).Count(&count)
	if count == 0 {
		mockData := GetMockInitialSymptomps()
		for _, d := range mockData {
			DB.Create(&d)
		}
		log.Println("✅ Added mock Appointment data")
	} else {
		log.Println("⚡ Appointment table already has data")
	}

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
		Position, EmpType, License                                    string
		CompRate                                                      float32
		Specialization                                                string
		StartDate                                                     time.Time
	}{
		{"ทพ.", "Somsak", "Thongdee", "ชาย", "somsak@clinic.com", "1234567890123", "0812345678",
			"123 Moo 1", "Nongprue", "Muang", "Nakhon Ratchasima", 45,
			"ทันตแพทย์", "Part-time", "D54321", 20000, "ทันตกรรมจัดฟัน",
			time.Date(2015, 3, 1, 0, 0, 0, 0, time.UTC)},

		{"ทพ.ญ.", "Suda", "Kanya", "หญิง", "suda@clinic.com", "9876543210987", "0891112222",
			"456 Sukhumvit Rd", "", "Bangkok", "", 45,
			"ผู้ช่วย", "Full-time", "A00002", 15000, "",
			time.Date(2021, 9, 10, 0, 0, 0, 0, time.UTC)},

		{"นาย", "Anan", "Chaiyos", "ชาย", "anan@clinic.com", "1122334455667", "0895551111",
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
				{HouseNumber: "123", Moo: "1", Subdistrict: "ในเมือง", District: "เมือง", Province: "ขอนแก่น", Postcode: "40000"},
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
				{HouseNumber: "456", Moo: "2", Subdistrict: "ลาดพร้าว", District: "บางกะปิ", Province: "กรุงเทพฯ", Postcode: "10240"},
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
		if err := DB.Create(&p).Error; err != nil {
			log.Printf("❌ Failed to seed patient %s: %v", p.FirstName, err)
		}
	}

	// Seed additional users for frontend
	seedAdditionalUsers()
	
	// Seed payment data
	seedPaymentData()
	
	// Seed attendance data
	seedAttendanceData()
	
	log.Println("✅ Database seeded successfully!")
}

// seedAdditionalUsers creates additional users for frontend testing
func seedAdditionalUsers() {
	// Create admin users
	adminUsers := []entity.User{
		{
			Email:       "admin@clinic.com",
			Password:    "$2a$14$example_hashed_password_admin123", // password: admin123
			Role:        "admin",
			FirstName:   "Dr. Sarah",
			LastName:    "Johnson",
			PhoneNumber: "0812345678",
			IsActive:    true,
			Department:  "Management",
			Position:    "Chief Administrator",
		},
		{
			Email:       "dentist@clinic.com", 
			Password:    "$2a$14$example_hashed_password_dentist123", // password: dentist123
			Role:        "admin",
			FirstName:   "Dr. Michael",
			LastName:    "Chen",
			PhoneNumber: "0823456789",
			IsActive:    true,
			Department:  "Dental",
			Position:    "Senior Dentist",
		},
		{
			Email:       "nurse@clinic.com",
			Password:    "$2a$14$example_hashed_password_nurse123", // password: nurse123
			Role:        "admin", 
			FirstName:   "Lisa",
			LastName:    "Williams",
			PhoneNumber: "0834567890",
			IsActive:    true,
			Department:  "Nursing",
			Position:    "Head Nurse",
		},
	}

	// Create patient users
	patientUsers := []entity.User{
		{
			Email:       "patient1@example.com",
			Password:    "$2a$14$example_hashed_password_patient123", // password: patient123
			Role:        "patient",
			FirstName:   "John",
			LastName:    "Smith",
			PhoneNumber: "0845678901",
			DateOfBirth: "1985-03-15",
			CitizenID:   "1234567890123",
			IsActive:    true,
		},
		{
			Email:       "patient2@example.com",
			Password:    "$2a$14$example_hashed_password_patient123",
			Role:        "patient", 
			FirstName:   "Emma",
			LastName:    "Davis",
			PhoneNumber: "0856789012",
			DateOfBirth: "1990-07-22",
			CitizenID:   "2345678901234",
			IsActive:    true,
		},
		{
			Email:       "patient3@example.com",
			Password:    "$2a$14$example_hashed_password_patient123",
			Role:        "patient",
			FirstName:   "David",
			LastName:    "Wilson",
			PhoneNumber: "0867890123",
			DateOfBirth: "1988-11-08",
			CitizenID:   "3456789012345",
			IsActive:    true,
		},
	}

	// Insert admin users
	for _, user := range adminUsers {
		var existingUser entity.User
		if err := DB.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
			if err := DB.Create(&user).Error; err != nil {
				log.Printf("❌ Failed to create admin user %s: %v", user.Email, err)
			} else {
				log.Printf("✅ Created admin user: %s", user.Email)
			}
		}
	}

	// Insert patient users
	for _, user := range patientUsers {
		var existingUser entity.User
		if err := DB.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
			if err := DB.Create(&user).Error; err != nil {
				log.Printf("❌ Failed to create patient user %s: %v", user.Email, err)
			} else {
				log.Printf("✅ Created patient user: %s", user.Email)
			}
		}
	}
}

// seedPaymentData creates sample payment records
func seedPaymentData() {
	payments := []entity.Payment{
		{
			TransactionNumber: "TXN20250912001",
			Amount:           1500.00,
			PaymentMethod:    "cash",
			Status:           "completed",
			PaymentDate:      time.Now().AddDate(0, 0, -5),
			Description:      "ขูดหินปูน - ทำความสะอาดฟัน",
			PatientID:        1,
			StaffID:          1,
			ServiceID:        1,
		},
		{
			TransactionNumber: "TXN20250912002", 
			Amount:           2500.00,
			PaymentMethod:    "credit_card",
			Status:           "completed",
			PaymentDate:      time.Now().AddDate(0, 0, -3),
			Description:      "อุดฟัน - รักษาฟันผุ",
			PatientID:        2,
			StaffID:          1,
			ServiceID:        2,
		},
		{
			TransactionNumber: "TXN20250912003",
			Amount:           3500.00,
			PaymentMethod:    "promptpay",
			Status:           "completed", 
			PaymentDate:      time.Now().AddDate(0, 0, -1),
			Description:      "ถอนฟัน - ฟันคุด",
			PatientID:        3,
			StaffID:          2,
			ServiceID:        3,
		},
		{
			TransactionNumber: "TXN20250912004",
			Amount:           5000.00,
			PaymentMethod:    "bank_transfer",
			Status:           "pending",
			PaymentDate:      time.Now(),
			Description:      "จัดฟัน - ใส่เครื่องมือจัดฟัน",
			PatientID:        1,
			StaffID:          2,
			ServiceID:        4,
		},
		{
			TransactionNumber: "TXN20250912005",
			Amount:           800.00,
			PaymentMethod:    "cash",
			Status:           "completed",
			PaymentDate:      time.Now().AddDate(0, 0, -7),
			Description:      "ตรวจสุขภาพฟัน - ตรวจประจำปี",
			PatientID:        2,
			StaffID:          1,
			ServiceID:        5,
		},
	}

	for _, payment := range payments {
		var existingPayment entity.Payment
		if err := DB.Where("transaction_number = ?", payment.TransactionNumber).First(&existingPayment).Error; err != nil {
			if err := DB.Create(&payment).Error; err != nil {
				log.Printf("❌ Failed to create payment %s: %v", payment.TransactionNumber, err)
			} else {
				log.Printf("✅ Created payment: %s", payment.TransactionNumber)
			}
		}
	}
}

// seedAttendanceData creates sample attendance records
func seedAttendanceData() {
	now := time.Now()
	attendances := []entity.Attendance{
		{
			StaffID:      1,
			Date:         now.AddDate(0, 0, -5),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -5).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -5).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      2,
			Date:         now.AddDate(0, 0, -5),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -5).Add(8*time.Hour + 15*time.Minute)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -5).Add(17 * time.Hour)}[0],
			WorkHours:    8.75,
			Status:       "late",
			Notes:        "Traffic jam",
			Location:     "Main Clinic",
			IsLate:       true,
			LateMinutes:  15,
		},
		{
			StaffID:      1,
			Date:         now.AddDate(0, 0, -4),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -4).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -4).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      2,
			Date:         now.AddDate(0, 0, -4),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -4).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -4).Add(12 * time.Hour)}[0],
			WorkHours:    4.0,
			Status:       "half_day",
			Notes:        "Medical appointment",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      1,
			Date:         now.AddDate(0, 0, -3),
			CheckInTime:  nil,
			CheckOutTime: nil,
			WorkHours:    0.0,
			Status:       "absent",
			Notes:        "Sick leave",
			Location:     "",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      2,
			Date:         now.AddDate(0, 0, -3),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -3).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -3).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      1,
			Date:         now.AddDate(0, 0, -2),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -2).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -2).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      2,
			Date:         now.AddDate(0, 0, -2),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -2).Add(8*time.Hour + 30*time.Minute)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -2).Add(17 * time.Hour)}[0],
			WorkHours:    8.5,
			Status:       "late",
			Notes:        "Car trouble",
			Location:     "Main Clinic",
			IsLate:       true,
			LateMinutes:  30,
		},
		{
			StaffID:      1,
			Date:         now.AddDate(0, 0, -1),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -1).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -1).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
		{
			StaffID:      2,
			Date:         now.AddDate(0, 0, -1),
			CheckInTime:  &[]time.Time{now.AddDate(0, 0, -1).Add(8 * time.Hour)}[0],
			CheckOutTime: &[]time.Time{now.AddDate(0, 0, -1).Add(17 * time.Hour)}[0],
			WorkHours:    9.0,
			Status:       "present",
			Notes:        "Regular work day",
			Location:     "Main Clinic",
			IsLate:       false,
			LateMinutes:  0,
		},
	}

	for _, attendance := range attendances {
		var existingAttendance entity.Attendance
		if err := DB.Where("staff_id = ? AND date = ?", attendance.StaffID, attendance.Date.Format("2006-01-02")).First(&existingAttendance).Error; err != nil {
			if err := DB.Create(&attendance).Error; err != nil {
				log.Printf("❌ Failed to create attendance for staff %d on %s: %v", attendance.StaffID, attendance.Date.Format("2006-01-02"), err)
			} else {
				log.Printf("✅ Created attendance for staff %d on %s", attendance.StaffID, attendance.Date.Format("2006-01-02"))
			}
		}
	}
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
