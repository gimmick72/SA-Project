package main

import (
	"Database/entity"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {

	// Connect DB
	db, err := gorm.Open(sqlite.Open("DatabaseProject_SA.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect database")
	}

	// Migrate tables
	db.AutoMigrate(&entity.PersonalData{}, &entity.Department{})

	// Seed staff data
	seedStaff(db)

	// Initialize Gin
	r := gin.Default()

	r.GET( "/", func(c *gin.Context) {
		c.String(http.StatusOK, "API ไทม์เองอิอิ\nพิพม์ /staff เพื่อดูข้อมูลพนักงาน")
	})

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Route: GET /staff
	r.GET("/staff", func(c *gin.Context) {
		var departments []entity.Department
		if err := db.Preload("PersonalData").Find(&departments).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, departments)
	})

	log.Println("Server running at http://localhost:8080")
	r.Run(":8080")
}

// seedStaff inserts staff data if not exists
func seedStaff(db *gorm.DB) {
	staff := []struct {
		Title, FullName, Gender, Email, EmpNationalID, Tel, Address, Position, EmpType, License string
		Age                                                                                     int
		StartDate                                                                               string
	}{
		{"ทพ.", "Somsak Thongdee", "ชาย", "somsak@clinic.com", "1234567890123", "081-234-5678", "123 Moo 1, T.Nongprue, A.Muang, N.Ratchasima", "ทันตแพทย์", "Full-time", "D12345", 45, "2010-01-15"},
		{"ทพ.ญ.", "Suda Kanya", "หญิง", "suda@clinic.com", "9876543210987", "089-111-2222", "456 Sukhumvit Rd, BKK", "ทันตแพทย์", "Part-time", "D54321", 38, "2015-03-01"},
		{"นาย", "Anan Chaiyos", "ชาย", "anan@clinic.com", "1122334455667", "089-555-1111", "88 Rama 2 Rd, BKK", "ผู้ช่วย", "Full-time", "A00002", 29, "2021-09-10"},
		{"นางสาว", "Jiraporn Meechai", "หญิง", "jiraporn@clinic.com", "2233445566778", "091-234-4567", "12 Soi Latkrabang, BKK", "เจ้าหน้าที่แผนกต้อนรับ", "Full-time", "", 32, "2018-11-01"},
		{"ทพ.", "Nattapong Preecha", "ชาย", "nattapong@clinic.com", "3344556677889", "080-999-0000", "567 Moo 5, Chiang Mai", "ทันตแพทย์", "Full-time", "D67890", 40, "2013-06-25"},
		{"ทพ.ญ.", "Chanida Ruangroj", "หญิง", "chanida@clinic.com", "5566778899001", "083-456-7890", "23 Rama 4 Rd, BKK", "ทันตแพทย์", "Part-time", "D09876", 34, "2019-04-10"},
		{"นางสาว", "Sirilak Thongchai", "หญิง", "sirilak@clinic.com", "6655443322110", "082-888-9999", "101 Ratchada Rd, BKK", "ผู้ช่วยทันตแพทย์", "Full-time", "A12345", 26, "2022-01-05"},
		{"นาย", "Pongsak Dechmongkol", "ชาย", "pongsak@clinic.com", "7788990011223", "085-333-4444", "66 Ladprao Rd, BKK", "เจ้าหน้าที่การเงิน", "Full-time", "", 36, "2016-08-12"},
		{"ทพ.", "Kasem Prasert", "ชาย", "kasem@clinic.com", "1122446688990", "086-111-2222", "234 Moo 3, A.Tha Muang, Kanchanaburi", "ทันตแพทย์", "Full-time", "D00123", 50, "2009-12-01"},
		{"ทพ.ญ.", "Panida Srisuk", "หญิง", "panida@clinic.com", "9988776655443", "084-777-8888", "90 Huay Kwang, BKK", "ทันตแพทย์", "Part-time", "D87654", 30, "2023-06-10"},
		{"นางสาว", "Kamonwan Chalermchai", "หญิง", "kamonwan@clinic.com", "4455667788991", "087-999-1122", "19 Bangna-Trad Rd, BKK", "เจ้าหน้าที่แผนกต้อนรับ", "Full-time", "", 27, "2020-02-20"},
		{"นาย", "Arthit Krittayapong", "ชาย", "arthit@clinic.com", "3344667788992", "088-123-4567", "55 Moo 2, Nakhon Pathom", "ช่างซ่อมบำรุง", "Full-time", "", 41, "2017-10-15"},
	}

	for _, s := range staff {
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
			Age:           s.Age,
			EmpNationalID: s.EmpNationalID,
			Tel:           s.Tel,
			HouseNumber:   s.Address,
		}

		db.Create(&p)

		startDate, _ := time.Parse("2006-01-02", s.StartDate)
		d := entity.Department{
			Position:       s.Position,
			EmpType:        s.EmpType,
			AffBrance:      "Main Clinic",
			License:        s.License,
			StartDate:      startDate,
			PersonalDataID: p.ID,
		}

		db.Create(&d)
	}

	log.Println("✅ Seeded all staff successfully!")

	db.AutoMigrate(
		&entity.CaseData{},
		&entity.ToothNumber{},
		&entity.ToothPosition{},
		// &entity.Treatment{},
		&entity.TreatmentTooth{},
	)

	//DentistMenagement
	db.AutoMigrate(
		&entity.DentistMenagement{})

	//Member
	db.AutoMigrate(
		&entity.Member{},
		&entity.Role{},
		&entity.MemberRole{},
	)

	//Patient
	db.AutoMigrate(
		&entity.Patient{},
		&entity.ContactPerson{},
		&entity.Address{},
		&entity.InitialSymptomps{},
		&entity.InitialSymptomps{},
	)

	//Payment
	db.AutoMigrate(
		&entity.CouterService{},
		&entity.CashPayment{},
		&entity.OnlinePayment{},
		&entity.CreditCard{},
		&entity.Transaction{},
	)

	db.AutoMigrate(
		entity.Queue{},
		&entity.Timeslot{},
	)

	//Room
	db.AutoMigrate(
		&entity.Room{},
		&entity.RoomReservation{},
	)

	//Service
	db.AutoMigrate(
		&entity.Service{},
		&entity.Promotion{},
		&entity.ServicePromotion{},
	)

	//StaffWorkTime
	db.AutoMigrate(
		&entity.Shifts{},
		&entity.Schedules{},
	)

	//Supply
	db.AutoMigrate(
		&entity.Supply{},
		&entity.RecordSupple{},
	)

	//Use for create Data mocup //
	//Insert Data
	// 	db.Create(&entity.Service{
	// 	NameService: "healty",
	// 	DetailService: "xxxxxxxxxxxxxxxx",
	// 	Cost: 100.00,
	// })

}
