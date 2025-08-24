package configs

import (
	"Database/entity"
	
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

// DB คือ global database connection
var DB *gorm.DB

func getDB() *gorm.DB {
	return DB
}

// main.go หรือ configs/db.go

// ConnectDatabase เชื่อมต่อฐานข้อมูล SQLite และเก็บ instance ไว้ที่ DB
func ConnectDatabase() {
	var err error
	dsn := "DatabaseProject_SA.db?_pragma=foreign_keys(1)" // ใช้ไฟล์เดียวกับ main.go
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}
	log.Println("✅ Connected to SQLite database")
}

func SetupDatabase() {

	DB.AutoMigrate(
        //CaseData
		&entity.CaseData{},
        &entity.ToothNumber{},
        &entity.ToothPosition{},
        &entity.Treatment{},
        &entity.TreatmentTooth{},
    

        //DentistManagement
		&entity.DentistMenagement{},

        //Member
		&entity.Member{},
        &entity.Role{},
        &entity.MemberRole{},

        //Patient
		&entity.Patient{},
        &entity.ContactPerson{},
        &entity.Address{},
        &entity.InitialSymptomps{},
        &entity.HistoryPatien{},


        //Payment
		&entity.CouterService{},
        &entity.CashPayment{},
        &entity.OnlinePayment{},
        &entity.CreditCard{},
        &entity.Transaction{},

        //PersonalData
		&entity.PersonalData{},
        &entity.Department{},

        //Queue
		&entity.Queue{},
        &entity.Timeslot{},

        //Room
		&entity.Room{},
        &entity.RoomReservation{},

        //Service
		&entity.Service{},
        &entity.Promotion{},
        &entity.ServicePromotion{},

        //StaffWorkTime
		&entity.Shifts{},
        &entity.Schedules{},

        //Supply
		&entity.Supply{},
        &entity.RecordSupply{},
	)
}
