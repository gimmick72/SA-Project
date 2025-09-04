package configs

import (
	"Database/entity"
	"log"
	"strings"
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
	SeedPersonalData()
	SeedDepartments()
}

var personalIDs []uint

// ------------------- SEED PERSONAL DATA -------------------
func SeedPersonalData() {

	var count int64
	db.Model(&entity.PersonalData{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ PersonalData already seeded, skipping...")
		return
	}

	staffList := []struct {
		Title, FullName, Gender, Email, EmpNationalID, Tel string
		HouseNumber, Subdistrict, District, VillageNumber  string
		age                                                int
	}{
		{"ทพ.", "Somsak Thongdee", "ชาย", "somsak@clinic.com", "1234567890123", "081-234-5678", "123 Moo 1", "Nongprue", "Muang", "Nakhon Ratchasima", 45},
		{"ทพ.ญ.", "Suda Kanya", "หญิง", "suda@clinic.com", "9876543210987", "089-111-2222", "456 Sukhumvit Rd", "", "Bangkok", "", 45},
		{"นาย", "Anan Chaiyos", "ชาย", "anan@clinic.com", "1122334455667", "089-555-1111", "88 Rama 2 Rd", "", "Bangkok", "", 45},
		// {"นางสาว", "Jiraporn Meechai", "หญิง", "jiraporn@clinic.com", "2233445566778", "091-234-4567", "12 Soi Latkrabang, BKK", 45},
		// {"ทพ.", "Nattapong Preecha", "ชาย", "nattapong@clinic.com", "3344556677889", "080-999-0000", "567 Moo 5, Chiang Mai", 45},
		// {"ทพ.ญ.", "Chanida Ruangroj", "หญิง", "chanida@clinic.com", "5566778899001", "083-456-7890", "23 Rama 4 Rd, BKK", 45},
		// {"นางสาว", "Sirilak Thongchai", "หญิง", "sirilak@clinic.com", "6655443322110", "082-888-9999", "101 Ratchada Rd, BKK", 45},
		// {"นาย", "Pongsak Dechmongkol", "ชาย", "pongsak@clinic.com", "7788990011223", "085-333-4444", "66 Ladprao Rd, BKK", 45},
		// {"ทพ.", "Kasem Prasert", "ชาย", "kasem@clinic.com", "1122446688990", "086-111-2222", "234 Moo 3, A.Tha Muang, Kanchanaburi", 45},
		// {"ทพ.ญ.", "Panida Srisuk", "หญิง", "panida@clinic.com", "9988776655443", "084-777-8888", "90 Huay Kwang, BKK", 45},
		// {"นางสาว", "Kamonwan Chalermchai", "หญิง", "kamonwan@clinic.com", "4455667788991", "087-999-1122", "19 Bangna-Trad Rd, BKK", 45},
		// {"นาย", "Arthit Krittayapong", "ชาย", "arthit@clinic.com", "3344667788992", "088-123-4567", "55 Moo 2, Nakhon Pathom", 45},
	}

	for _, s := range staffList {
		names := strings.SplitN(s.FullName, " ", 2)
		firstName := names[0]
		lastName := ""
		if len(names) > 1 {
			lastName = names[1]
		}

		p := entity.PersonalData{
			Title:         s.Title,
			FirstName:     firstName,
			LastName:      lastName,
			Gender:        s.Gender,
			Email:         s.Email,
			Age:           s.age,
			EmpNationalID: s.EmpNationalID,
			Tel:           s.Tel,
			HouseNumber:   s.HouseNumber,
			Subdistrict:   s.Subdistrict,
			District:      s.District,
			VillageNumber: s.VillageNumber,
		}
		db.Create(&p)
		personalIDs = append(personalIDs, p.ID) // เก็บ ID
	}
}

// ------------------- SEED DEPARTMENTS -------------------
func SeedDepartments() {

	var count int64
	db.Model(&entity.Department{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️ Departments already seeded, skipping...")
		return
	}

	deptList := []struct {
		PersonalDataID uint
		Position       string
		EmpType        string
		AffBrance      string
		License        string
		CompRate       float32
		// LicenseDate    time.Time
		Specialization string
		StartDate      time.Time
	}{
		{1, "ทันตแพทย์", "Part-time", "Main Clinic", "D54321", 20000, "ทันตกรรมจัดฟัน", time.Date(2015, 3, 1, 0, 0, 0, 0, time.UTC)},
		{2, "ผู้ช่วย", "Full-time", "Main Clinic", "A00002", 15000, "", time.Date(2021, 9, 10, 0, 0, 0, 0, time.UTC)},
		{3, "เจ้าหน้าที่แผนกต้อนรับ", "Full-time", "Main Clinic", "", 12000, "", time.Date(2018, 11, 1, 0, 0, 0, 0, time.UTC)},
		{4, "ทันตแพทย์", "Full-time", "Main Clinic", "D67890", 0, "", time.Date(2013, 6, 25, 0, 0, 0, 0, time.UTC)},
		{5, "ทันตแพทย์", "Part-time", "Main Clinic", "D09876", 0, "", time.Date(2019, 4, 10, 0, 0, 0, 0, time.UTC)},
		{6, "ผู้ช่วยทันตแพทย์", "Full-time", "Main Clinic", "A12345", 0, "", time.Date(2022, 1, 5, 0, 0, 0, 0, time.UTC)},
		{7, "เจ้าหน้าที่การเงิน", "Full-time", "Main Clinic", "", 0, "", time.Date(2016, 8, 12, 0, 0, 0, 0, time.UTC)},
		{8, "ทันตแพทย์", "Full-time", "Main Clinic", "D00123", 0, "", time.Date(2009, 12, 1, 0, 0, 0, 0, time.UTC)},
		{9, "ทันตแพทย์", "Part-time", "Main Clinic", "D87654", 0, "", time.Date(2023, 6, 10, 0, 0, 0, 0, time.UTC)},
		{10, "เจ้าหน้าที่แผนกต้อนรับ", "Full-time", "Main Clinic", "", 0, "", time.Date(2020, 2, 20, 0, 0, 0, 0, time.UTC)},
		{11, "ช่างซ่อมบำรุง", "Full-time", "Main Clinic", "", 0, "", time.Date(2017, 10, 15, 0, 0, 0, 0, time.UTC)},
	}

	for i, d := range deptList {
		if i < len(personalIDs) { // ป้องกัน index out of range
			db.Create(&entity.Department{
				PersonalDataID: personalIDs[i],
				Position:       d.Position,
				EmpType:        d.EmpType,
				License:        d.License,
				StartDate:      d.StartDate,
				AffBrance:      d.AffBrance,
				CompRate:       d.CompRate,
				// LicenseDate:    d.LicenseDate,
				Specialization: d.Specialization,
			})
		}
	}

	log.Println("✅ Seeded all departments successfully!")

}
