package controllers

import (
	"time"
	"Database/entity"
)

// -------------------- DentistManagement --------------------
func GetMockDentists() []entity.DentistManagement {
	return []entity.DentistManagement{
		{Room: "A101", TimeIn: time.Date(2025, 9, 1, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 1, 13, 0, 0, 0, time.Local), Dentist: "หมอสมชาย"},
		{Room: "B102", TimeIn: time.Date(2025, 9, 2, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 2, 13, 0, 0, 0, time.Local), Dentist: "หมอวิภา"},
		{Room: "C103", TimeIn: time.Date(2025, 9, 3, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 3, 13, 0, 0, 0, time.Local), Dentist: "หมออนันต์"},
		{Room: "D104", TimeIn: time.Date(2025, 9, 4, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 4, 13, 0, 0, 0, time.Local), Dentist: "หมอศิริพร"},
		{Room: "E105", TimeIn: time.Date(2025, 9, 5, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 5, 13, 0, 0, 0, time.Local), Dentist: "หมอธีระ"},
		{Room: "F106", TimeIn: time.Date(2025, 9, 6, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 6, 13, 0, 0, 0, time.Local), Dentist: "หมอสุรินทร์"},
		{Room: "G107", TimeIn: time.Date(2025, 9, 7, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 7, 13, 0, 0, 0, time.Local), Dentist: "หมอวรรณา"},
		{Room: "H108", TimeIn: time.Date(2025, 9, 8, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 8, 13, 0, 0, 0, time.Local), Dentist: "หมอปริญญา"},
		{Room: "I109", TimeIn: time.Date(2025, 9, 9, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 9, 13, 0, 0, 0, time.Local), Dentist: "หมอประพันธ์"},
		{Room: "J110", TimeIn: time.Date(2025, 9, 10, 9, 0, 0, 0, time.Local), TimeOut: time.Date(2025, 9, 10, 13, 0, 0, 0, time.Local), Dentist: "หมอธนกร"},
	}
}


// -------------------- Category --------------------
func GetMockCategories() []entity.Category {
	return []entity.Category{
		{NameCategory: "ฟันผุ"},
		{NameCategory: "ฟอกสีฟัน"},
		{NameCategory: "ถอนฟัน"},
		{NameCategory: "จัดฟัน"},
		{NameCategory: "รักษารากฟัน"},
		{NameCategory: "เคลือบฟลูออไรด์"},
		{NameCategory: "ครอบฟัน"},
		{NameCategory: "ขูดหินปูน"},
		{NameCategory: "ขัดฟัน"},
		{NameCategory: "ฟันปลอม"},
	}
}

// -------------------- Service --------------------
func GetMockServices() []entity.Service {
	return []entity.Service{
		{NameService: "ขูดหินปูน", DetailService: "ทำความสะอาดฟัน", Cost: 500, CategoryID: 1},
		{NameService: "ถอนฟัน", DetailService: "ถอนฟันที่ผุ", Cost: 800, CategoryID: 3},
		{NameService: "ฟอกสีฟัน", DetailService: "ฟอกสีฟันให้ขาว", Cost: 1500, CategoryID: 2},
		{NameService: "จัดฟัน", DetailService: "ปรับฟันให้ตรง", Cost: 5000, CategoryID: 4},
		{NameService: "ครอบฟัน", DetailService: "ครอบฟันเสีย", Cost: 2000, CategoryID: 7},
		{NameService: "รักษารากฟัน", DetailService: "รักษารากฟัน", Cost: 3000, CategoryID: 5},
		{NameService: "ขัดฟัน", DetailService: "ขัดฟันให้สะอาด", Cost: 400, CategoryID: 9},
		{NameService: "เคลือบฟลูออไรด์", DetailService: "เคลือบฟลูออไรด์", Cost: 300, CategoryID: 6},
		{NameService: "ฟันปลอม", DetailService: "ใส่ฟันปลอม", Cost: 2500, CategoryID: 10},
		{NameService: "ฟันผุ", DetailService: "อุดฟันผุ", Cost: 600, CategoryID: 1},
	}
}



// ------------------- Promotion --------------------
func GetMockPromotions() []entity.Promotion{
	return []entity.Promotion{
		{NamePromotion: "ลด 10% ตรวจฟัน", ServiceID: 1, PromotionDetail: "ลด 10% ตรวจฟันทั่วไป", Cost: 450, DateStart: time.Date(2025, 9, 1, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 9, 30, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ขูดหินปูนลด 200 บาท", ServiceID: 2, PromotionDetail: "ขูดหินปูนลดราคา 200 บาท", Cost: 600, DateStart: time.Date(2025, 9, 5, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 9, 25, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ฟอกสีฟัน 20% Off", ServiceID: 3, PromotionDetail: "ลด 20% ฟอกสีฟัน", Cost: 1200, DateStart: time.Date(2025, 9, 10, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 10, 10, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "จัดฟัน 5% Off", ServiceID: 4, PromotionDetail: "จัดฟันลด 5%", Cost: 9500, DateStart: time.Date(2025, 9, 15, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 12, 31, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ตรวจฟัน + ขูดหินปูน 15% Off", ServiceID: 1, PromotionDetail: "ตรวจฟันและขูดหินปูนลด 15%", Cost: 1150, DateStart: time.Date(2025, 9, 1, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 9, 30, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ฟอกสีฟัน + ขูดหินปูน ลดรวม 500 บาท", ServiceID: 3, PromotionDetail: "ฟอกสีฟันและขูดหินปูนลด 500 บาท", Cost: 1800, DateStart: time.Date(2025, 9, 5, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 10, 5, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ตรวจฟันฟรีคูปอง", ServiceID: 1, PromotionDetail: "รับคูปองตรวจฟันฟรี 1 ครั้ง", Cost: 0, DateStart: time.Date(2025, 9, 20, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 10, 20, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "จัดฟันลดเพิ่ม 1000 บาท", ServiceID: 4, PromotionDetail: "จัดฟันลดเพิ่ม 1000 บาทสำหรับลูกค้าใหม่", Cost: 9000, DateStart: time.Date(2025, 10, 1, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 12, 31, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ขูดหินปูนฟรีวันเกิด", ServiceID: 2, PromotionDetail: "รับขูดหินปูนฟรีในวันเกิด", Cost: 0, DateStart: time.Date(2025, 1, 1, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 12, 31, 23, 59, 59, 0, time.Local)},
		{NamePromotion: "ฟอกสีฟันลด 50%", ServiceID: 3, PromotionDetail: "ฟอกสีฟันลด 50% เฉพาะลูกค้าเก่า", Cost: 750, DateStart: time.Date(2025, 9, 15, 0, 0, 0, 0, time.Local), DateEnd: time.Date(2025, 10, 15, 23, 59, 59, 0, time.Local)},
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
		{Date: time.Date(2025, 9, 8, 0, 0, 0, 0, time.UTC), RoomID: "A101", Time: "09:00", PatientID: "P001", PatientName: "สมชาย ใจดี", Type: "appointment", DurationMin: ptrInt(30)},
		{Date: time.Date(2025, 9, 8, 0, 0, 0, 0, time.UTC), RoomID: "A101", Time: "09:30", PatientID: "P002", PatientName: "วิภา สายสุข", Type: "walkin", DurationMin: ptrInt(45)},
		{Date: time.Date(2025, 9, 8, 0, 0, 0, 0, time.UTC), RoomID: "B202", Time: "10:00", PatientID: "P003", PatientName: "อนันต์ รักเรียน", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 8, 0, 0, 0, 0, time.UTC), RoomID: "B202", Time: "11:00", PatientID: "P004", PatientName: "ศิริพร นุ่มนวล", Type: "walkin", DurationMin: ptrInt(30)},
		{Date: time.Date(2025, 9, 9, 0, 0, 0, 0, time.UTC), RoomID: "C303", Time: "08:30", PatientID: "P005", PatientName: "ธีระ กล้าหาญ", Type: "appointment", DurationMin: ptrInt(45)},
		{Date: time.Date(2025, 9, 9, 0, 0, 0, 0, time.UTC), RoomID: "C303", Time: "09:15", PatientID: "P006", PatientName: "สมหญิง ใจดี", Type: "walkin", DurationMin: ptrInt(30)},
		{Date: time.Date(2025, 9, 9, 0, 0, 0, 0, time.UTC), RoomID: "D404", Time: "10:00", PatientID: "P007", PatientName: "วิชาญ แกร่งกล้า", Type: "appointment", DurationMin: ptrInt(60)},
		{Date: time.Date(2025, 9, 10, 0, 0, 0, 0, time.UTC), RoomID: "D404", Time: "11:00", PatientID: "P008", PatientName: "รัตนา งามดี", Type: "walkin", DurationMin: ptrInt(30)},
		{Date: time.Date(2025, 9, 10, 0, 0, 0, 0, time.UTC), RoomID: "E505", Time: "08:00", PatientID: "P009", PatientName: "สมบัติ สุขใจ", Type: "appointment", DurationMin: ptrInt(45)},
		{Date: time.Date(2025, 9, 10, 0, 0, 0, 0, time.UTC), RoomID: "E505", Time: "08:45", PatientID: "P010", PatientName: "วิไลพร สดใส", Type: "walkin", DurationMin: ptrInt(30)},
	}
}

func ptrInt(v int) *int {
    return &v
}



