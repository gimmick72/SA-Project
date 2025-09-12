package configs

import (
	"Database/entity"
	"time"
	"log"
	"fmt"
)

// -------------------- DentistManagement --------------------
func GetMockDentists() []entity.DentistManagement {
	return []entity.DentistManagement{
		{Room: "B001", TimeIn: time.Date(2025, 9, 1, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 1, 13, 0, 0, 0, time.Local), Dentist: "หมอสมชาย"},
		{Room: "B002", TimeIn: time.Date(2025, 9, 2, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 2, 13, 0, 0, 0, time.Local), Dentist: "หมอวิภา"},
		{Room: "B003", TimeIn: time.Date(2025, 9, 3, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 3, 13, 0, 0, 0, time.Local), Dentist: "หมออนันต์"},
		{Room: "B004", TimeIn: time.Date(2025, 9, 4, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 4, 13, 0, 0, 0, time.Local), Dentist: "หมอศิริพร"},
		{Room: "B004", TimeIn: time.Date(2025, 9, 5, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 5, 13, 0, 0, 0, time.Local), Dentist: "หมอธีระ"},
		{Room: "B001", TimeIn: time.Date(2025, 9, 6, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 6, 13, 0, 0, 0, time.Local), Dentist: "หมอสุรินทร์"},
		{Room: "B002", TimeIn: time.Date(2025, 9, 7, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 7, 13, 0, 0, 0, time.Local), Dentist: "หมอวรรณา"},
		{Room: "B003", TimeIn: time.Date(2025, 9, 8, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 8, 13, 0, 0, 0, time.Local), Dentist: "หมอปริญญา"},
		{Room: "B004", TimeIn: time.Date(2025, 9, 9, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 9, 13, 0, 0, 0, time.Local), Dentist: "หมอประพันธ์"},
		{Room: "B001", TimeIn: time.Date(2025, 9, 10, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 10, 13, 0, 0, 0, time.Local), Dentist: "หมอธนกร"},
	}
}

// -------------------- Category --------------------
func GetMockCategories() []entity.Category {
	return []entity.Category{
		{NameCategory: "ทันตกรรมทั่วไป"},
		{NameCategory: "ทันตกรรมประดิษฐ์"},
		{NameCategory: "ทันตกรรมจัดฟัน"},
		{NameCategory: "ทันตกรรมปริทันต์"},
		{NameCategory: "ทันตกรรมเพื่อความงาม"},
		{NameCategory: "ทันตกรรมสำหรับเด็ก"},
		{NameCategory: "ทันตกรรมผ่าตัดช่องปาก"},
		{NameCategory: "ทันตกรรมรากฟันเทียม"},
		{NameCategory: "ทันตกรรมเฉพาะทางอื่น ๆ"},
	}
}

// ------------------- Promotion --------------------
func GetMockServices() []entity.Service {
	return []entity.Service{
		// 1. ทันตกรรมทั่วไป
		{NameService: "ขูดหินปูน", DetailService: "ทำความสะอาดฟัน", Cost: 500, CategoryID: 1},
		{NameService: "ฟันผุ", DetailService: "อุดฟันผุ", Cost: 600, CategoryID: 1},

		// 2. ทันตกรรมประดิษฐ์
		{NameService: "ฟอกสีฟัน", DetailService: "ฟอกสีฟันให้ขาว", Cost: 1500, CategoryID: 2},
		{NameService: "ฟันปลอมแบบถอดได้", DetailService: "ใส่ฟันปลอมแบบถอดได้", Cost: 2500, CategoryID: 2},

		// 3. ทันตกรรมจัดฟัน
		{NameService: "จัดฟันโลหะ", DetailService: "ปรับฟันให้ตรงด้วยโลหะ", Cost: 5000, CategoryID: 3},
		{NameService: "จัดฟันใส", DetailService: "ปรับฟันให้ตรงด้วยเครื่องมือใส", Cost: 8000, CategoryID: 3},

		// 4. ทันตกรรมปริทันต์
		{NameService: "รักษาเหงือกอักเสบ", DetailService: "รักษาเหงือกอักเสบ", Cost: 1200, CategoryID: 4},
		{NameService: "ผ่าตัดปริทันต์", DetailService: "ผ่าตัดเหงือกและกระดูกรองรับ", Cost: 3000, CategoryID: 4},

		// 5. ทันตกรรมเพื่อความงาม
		{NameService: "เคลือบฟันด้วยวัสดุสีเหมือนฟัน", DetailService: "เคลือบฟันให้สวยงาม", Cost: 1800, CategoryID: 5},
		{NameService: "ฟอกสีฟันด้วยเลเซอร์", DetailService: "ฟอกสีฟันให้ขาวด้วยเลเซอร์", Cost: 2500, CategoryID: 5},

		// 6. ทันตกรรมสำหรับเด็ก
		{NameService: "เคลือบฟลูออไรด์", DetailService: "เคลือบฟลูออไรด์ป้องกันฟันผุ", Cost: 300, CategoryID: 6},
		{NameService: "ถอนฟันน้ำนม", DetailService: "ถอนฟันน้ำนมที่ผุ", Cost: 400, CategoryID: 6},

		// 7. ทันตกรรมผ่าตัดช่องปาก
		{NameService: "ถอนฟันคุด", DetailService: "ผ่าตัดถอนฟันคุด", Cost: 2000, CategoryID: 7},
		{NameService: "ผ่าตัดซีสต์ในช่องปาก", DetailService: "ผ่าตัดซีสต์ในช่องปาก", Cost: 3500, CategoryID: 7},

		// 8. ทันตกรรมรากฟันเทียม
		{NameService: "ฝังรากฟันเทียม", DetailService: "ติดตั้งรากฟันเทียม", Cost: 15000, CategoryID: 8},
		{NameService: "ใส่ครอบฟันบนรากเทียม", DetailService: "ใส่ครอบฟันบนรากฟันเทียม", Cost: 5000, CategoryID: 8},

		// 9. ทันตกรรมเฉพาะทางอื่น ๆ
		{NameService: "ตรวจวิเคราะห์ด้วยรังสี", DetailService: "ตรวจวิเคราะห์สภาพฟันและเหงือกด้วย X-ray", Cost: 800, CategoryID: 9},
		{NameService: "ปรึกษาทางทันตกรรมเฉพาะทาง", DetailService: "ให้คำปรึกษาด้านทันตกรรมเฉพาะทาง", Cost: 500, CategoryID: 9},
	}
}

// -------------------- Promotion --------------------
func GetMockPromotions() []entity.Promotion {
	return []entity.Promotion{
		{
			NamePromotion:   "ลด 10% ตรวจฟัน",
			ServiceID:       1,
			PromotionDetail: "ลด 10% ตรวจฟันทั่วไป",
			Cost:            450,
			DateStart:       time.Date(2025, 9, 1, 0, 0, 0, 0, time.Local),
			DateEnd:         time.Date(2025, 9, 30, 23, 59, 59, 0, time.Local),
		},
		{
			NamePromotion:   "ฟอกสีฟัน 20% Off",
			ServiceID:       3,
			PromotionDetail: "ลด 20% ฟอกสีฟัน",
			Cost:            1200,
			DateStart:       time.Date(2025, 9, 10, 0, 0, 0, 0, time.Local),
			DateEnd:         time.Date(2025, 10, 10, 23, 59, 59, 0, time.Local),
		},
		{
			NamePromotion:   "จัดฟัน 5% Off",
			ServiceID:       4,
			PromotionDetail: "จัดฟันลด 5%",
			Cost:            9500,
			DateStart:       time.Date(2025, 9, 15, 0, 0, 0, 0, time.Local),
			DateEnd:         time.Date(2025, 12, 31, 23, 59, 59, 0, time.Local),
		},
	}
}

// -------------------- Supply --------------------
func GetMockSupplies() []entity.Supply {
	now := time.Now()
	return []entity.Supply{
		{Code: "S001", Name: "ยาสีฟัน", Category: "ทันตกรรม", Quantity: 100, Unit: "ชิ้น", ImportDate: now.AddDate(0, -1, 0), ExpiryDate: now.AddDate(1, 0, 0)},
		{Code: "S002", Name: "แปรงสีฟัน", Category: "ทันตกรรม", Quantity: 50, Unit: "ชิ้น", ImportDate: now.AddDate(0, -2, 0), ExpiryDate: now.AddDate(1, 0, 0)},
		{Code: "S003", Name: "ไหมขัดฟัน", Category: "ทันตกรรม", Quantity: 200, Unit: "ม้วน", ImportDate: now.AddDate(0, -1, -5), ExpiryDate: now.AddDate(2, 0, 0)},
		{Code: "S004", Name: "น้ำยาบ้วนปาก", Category: "ทันตกรรม", Quantity: 80, Unit: "ขวด", ImportDate: now.AddDate(0, -3, 0), ExpiryDate: now.AddDate(1, 6, 0)},
		{Code: "S005", Name: "ผ้าก๊อซ", Category: "อุปกรณ์", Quantity: 500, Unit: "แผ่น", ImportDate: now.AddDate(0, -1, -10), ExpiryDate: now.AddDate(2, 0, 0)},
		{Code: "S006", Name: "ถุงมือยาง", Category: "อุปกรณ์", Quantity: 300, Unit: "คู่", ImportDate: now.AddDate(0, -2, -3), ExpiryDate: now.AddDate(1, 6, 0)},
		{Code: "S007", Name: "หน้ากากอนามัย", Category: "อุปกรณ์", Quantity: 1000, Unit: "ชิ้น", ImportDate: now.AddDate(0, -1, -15), ExpiryDate: now.AddDate(1, 0, 0)},
		{Code: "S008", Name: "ยาแก้ปวด", Category: "ยา", Quantity: 150, Unit: "เม็ด", ImportDate: now.AddDate(0, -1, 0), ExpiryDate: now.AddDate(2, 0, 0)},
		{Code: "S009", Name: "ยาชา", Category: "ยา", Quantity: 50, Unit: "หลอด", ImportDate: now.AddDate(0, -2, 0), ExpiryDate: now.AddDate(1, 0, 0)},
		{Code: "S010", Name: "น้ำยาฆ่าเชื้อ", Category: "อุปกรณ์", Quantity: 60, Unit: "ขวด", ImportDate: now.AddDate(0, -1, -7), ExpiryDate: now.AddDate(1, 6, 0)},
	}
}

// -------------------- Appointment  --------------------
func GetMockAppointments() []entity.Appointment {
	return []entity.Appointment{
		{Date: time.Date(2025, 9, 10, 10, 0, 0, 0, time.UTC), RoomID: "1", Time: "10:00", PatientID: "P001", PatientName: "สมชาย ใจดี", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 10, 0, 0, 0, time.UTC), RoomID: "2", Time: "10:00", PatientID: "P002", PatientName: "วิภา สายสุข", Type: "walkin", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 11, 0, 0, 0, time.UTC), RoomID: "3", Time: "11:00", PatientID: "P003", PatientName: "อนันต์ รักเรียน", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 11, 0, 0, 0, time.UTC), RoomID: "4", Time: "11:00", PatientID: "P004", PatientName: "ศิริพร นุ่มนวล", Type: "walkin", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 12, 0, 0, 0, time.UTC), RoomID: "1", Time: "12:00", PatientID: "P005", PatientName: "ธีระ กล้าหาญ", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 12, 0, 0, 0, time.UTC), RoomID: "1", Time: "12:00", PatientID: "P006", PatientName: "สมหญิง ใจดี", Type: "walkin", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 13, 0, 0, 0, time.UTC), RoomID: "2", Time: "13:00", PatientID: "P007", PatientName: "วิชาญ แกร่งกล้า", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 13, 0, 0, 0, time.UTC), RoomID: "3", Time: "13:00", PatientID: "P008", PatientName: "รัตนา งามดี", Type: "walkin", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 14, 0, 0, 0, time.UTC), RoomID: "4", Time: "14:00", PatientID: "P009", PatientName: "สมบัติ สุขใจ", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 14, 0, 0, 0, time.UTC), RoomID: "4", Time: "14:00", PatientID: "P010", PatientName: "วิไลพร สดใส", Type: "walkin", DurationMin: ptrInt(60)},
	}
}

func ptrInt(v int) *int {
	return &v
}


func GetMockStatus() []entity.Status {
	return []entity.Status{
		{StatusName: "รอคิว"},
		{StatusName: "กำลังตรวจ"},
		{StatusName: "ชำระเงิน"},
		{StatusName: "เสร็จสิ้น"},
	}
}

func UintPtr(v uint) *uint { return &v }

func GetMockInitialSymptomps() []entity.InitialSymptomps {
	// แนะนำให้ seed ตามลำดับ: GetMockStatuses() -> GetMockServices() -> SeedPatient() -> GetMockInitialSymptomps()
	// โดยตัวอย่างนี้อ้างอิง:
	//   StatusID: 1=รอคิว, 2=กำลังตรวจ, 3=ชำระเงิน, 4=เสร็จสิ้น
	//   ServiceID: 1=ขูดหินปูน, 2=ฟันผุ(อุด), 3=ฟอกสีฟัน, 4=ฟันปลอม/ครอบฟัน (ปรับตามของคุณได้)
	//   PatientID: 1..6 (ปรับให้ตรงกับข้อมูลผู้ป่วยที่ seed ไว้จริง)

	base := time.Date(2025, 9, 12, 9, 0, 0, 0, time.Local)

	return []entity.InitialSymptomps{
		{
			Symptomps:     "ปวดฟันซี่ 36 เสียวเมื่อโดนเย็น",
			Visit:         base.Add(15 * time.Minute), // 09:15
			HeartRate:     "76",
			Weight:        65.0,
			Height:        170.0,
			ServiceID:     UintPtr(1),  // ขูดหินปูน (ตัวอย่าง)
			PatientID:     1,  // ผู้ป่วย ID=1
		},
		{
			Symptomps:     "เหงือกบวม เลือดออกง่าย ต้องการขูดหินปูน",
			Visit:         base.Add(45 * time.Minute), // 09:45
			HeartRate:     "74",
			Weight:        55.0,
			Height:        160.0,
			ServiceID:     UintPtr(2),
			PatientID:     2,
		},
		{
			Symptomps:     "ฟันผุด้านบดเคี้ยว เจ็บเวลาเคี้ยว",
			Visit:         base.Add(90 * time.Minute), // 10:30
			HeartRate:     "81",
			Weight:        70.5,
			Height:        175.0,
			ServiceID:     UintPtr(3),  // อุดฟัน
			PatientID:     3,
		},
		{
			Symptomps:     "ทำครอบฟันต่อจากรักษาราก",
			Visit:         base.Add(120 * time.Minute), // 11:00
			HeartRate:     "72",
			Weight:        58.3,
			Height:        162.0,
			ServiceID:     UintPtr(4),  // ครอบฟัน/ประดิษฐ์
			PatientID:     4,
		},
		{
			Symptomps:     "เสียวฟันเวลาโดนลมเย็น ฟันล่างขวา",
			Visit:         base.Add(180 * time.Minute), // 12:00
			HeartRate:     "77",
			Weight:        68.0,
			Height:        173.0,
			ServiceID:     UintPtr(5), // อุดฟัน
			PatientID:     5,
		},
		{
			Symptomps:     "ทำความสะอาดประจำปี",
			Visit:         base.Add(210 * time.Minute), // 12:30
			HeartRate:     "73",
			Weight:        52.4,
			Height:        158.0,
			ServiceID:     UintPtr(1), // ขูดหินปูน
			PatientID:     6,
		},
		{
			Symptomps:     "ฟอกสีฟัน เตรียมถ่ายภาพก่อนเริ่ม",
			Visit:         base.Add(240 * time.Minute), // 13:00
			HeartRate:     "75",
			Weight:        60.0,
			Height:        165.0,
			ServiceID:     UintPtr(2), // ฟอกสีฟัน
			PatientID:     1,
		},
		{
			Symptomps:     "ฟันปลอมหลวม ปวดบริเวณเหงือก",
			Visit:         base.Add(270 * time.Minute), // 13:30
			HeartRate:     "78",
			Weight:        62.0,
			Height:        166.0,
			ServiceID:     UintPtr(3), // ประดิษฐ์/ครอบฟัน/ฟันปลอม
			PatientID:     2,
		},
		{
			Symptomps:     "นัดอุดฟันซี่ 26 ระยะติดตามผล",
			Visit:         base.Add(300 * time.Minute), // 14:00
			HeartRate:     "71",
			Weight:        57.0,
			Height:        161.0,
			ServiceID:     UintPtr(3), // อุดฟัน
			PatientID:     3,
		},
		{
			Symptomps:     "ขูดหินปูน + เคลือบฟลูออไรด์",
			Visit:         base.Add(330 * time.Minute), // 14:30
			HeartRate:     "74",
			Weight:        66.0,
			Height:        171.0,
			ServiceID:     UintPtr(4), // ขูดหินปูน
			PatientID:     4,
		},
	}
}



//  SeedAddress
func SeedAddress() {
    var count int64
    DB.Model(&entity.Address{}).Count(&count)
    if count > 0 {
        log.Println("ℹ️ Address already seeded, skipping...")
        return
    }

    // ดึง patient มาใช้งาน (เอา patient คนแรก)
    var patient entity.Patient
    if err := DB.First(&patient).Error; err != nil {
        log.Println("❌ Cannot seed address because no patient exists")
        return
    }

    addresses := []entity.Address{
        {
            HouseNumber: "123",
            Moo:         "1",
            Subdistrict: "ในเมือง",
            District:    "เมือง",
            Province:    "ขอนแก่น",
            Postcode:    "40000",
            PatientID:   patient.ID, // ผูกกับ Patient
        },
        {
            HouseNumber: "45",
            Moo:         "3",
            Subdistrict: "ศิลา",
            District:    "เมือง",
            Province:    "ขอนแก่น",
            Postcode:    "40000",
            PatientID:   patient.ID, // mock อีกที่อยู่ ให้คนไข้คนเดิม
        },
    }

    for _, addr := range addresses {
        if err := DB.Create(&addr).Error; err != nil {
            log.Printf("❌ Failed to seed address: %v", err)
        }
    }

    log.Println("✅ Seeded addresses successfully!")
}


func SeedContactPerson() {
    var count int64
    DB.Model(&entity.ContactPerson{}).Count(&count)
    if count > 0 {
        log.Println("ℹ️ ContactPerson already seeded, skipping...")
        return
    }

    // ดึง patient มาใช้งาน (เอาคนแรก)
    var patient entity.Patient
    if err := DB.First(&patient).Error; err != nil {
        log.Println("❌ Cannot seed contact person because no patient exists")
        return
    }

    contacts := []entity.ContactPerson{
        {
            Relationship: "บิดา",
            PhoneNumber:  "0811111111",
            PatientID:    patient.ID, // ผูกกับ Patient
        },
        {
            Relationship: "มารดา",
            PhoneNumber:  "0822222222",
            PatientID:    patient.ID,
        },
    }

    for _, c := range contacts {
        if err := DB.Create(&c).Error; err != nil {
            log.Printf("❌ Failed to seed contact person: %v", err)
        }
    }

    log.Println("✅ Seeded contact persons successfully!")
}








// booking
func GetMockbooking() []entity.Booking {
	mockBookings := []entity.Booking{
		{
			ID:          1,
			FirstName:   "สมชาย",
			LastName:    "ใจดี",
			PhoneNumber: "0812345678",
			ServiceID:   101,
			SlotID:      1,
			Date:        time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:        "0900",
			Segment:     "morning",
			Status:      "confirmed",
		},
		{
			ID:          2,
			FirstName:   "สุมาลี",
			LastName:    "สุขใจ",
			PhoneNumber: "0898765432",
			ServiceID:   102,
			SlotID:      2,
			Date:        time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:        "1000",
			Segment:     "morning",
			Status:      "confirmed",
		},
		{
			ID:          3,
			FirstName:   "ประวิทย์",
			LastName:    "เก่งงาน",
			PhoneNumber: "0823456789",
			ServiceID:   103,
			SlotID:      3,
			Date:        time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:        "1400",
			Segment:     "afternoon",
			Status:      "cancelled",
		},
	}

	// ถ้าต้องการ debug
	for _, b := range mockBookings {
		fmt.Printf("%+v\n", b)
	}

	return mockBookings
}



// mockdata  QueueSlot
func GetMockQueueSlots() []entity.QueueSlot {
	mockSlots := []entity.QueueSlot{
		{
			Date:     time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:     "0900",
			Segment:  "morning",
			Capacity: 5,
			Used:     2,
		},
		{
			Date:     time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:     "1000",
			Segment:  "morning",
			Capacity: 5,
			Used:     1,
		},
		{
			Date:     time.Date(2025, 9, 12, 0, 0, 0, 0, time.Local),
			HHMM:     "1400",
			Segment:  "afternoon",
			Capacity: 4,
			Used:     0,
		},
		{
			Date:     time.Date(2025, 9, 13, 0, 0, 0, 0, time.Local),
			HHMM:     "0900",
			Segment:  "morning",
			Capacity: 5,
			Used:     3,
		},
		{
			Date:     time.Date(2025, 9, 13, 0, 0, 0, 0, time.Local),
			HHMM:     "1500",
			Segment:  "afternoon",
			Capacity: 4,
			Used:     2,
		},
	}

	// แสดง debug
	for _, s := range mockSlots {
		fmt.Printf("%+v\n", s)
	}

	return mockSlots
}