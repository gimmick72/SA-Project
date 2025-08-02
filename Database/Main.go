package main

import (
	"Database/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("DatabaseProject_SA.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect database")
	}

	//Create Table//
	//CaseData
	db.AutoMigrate(&entity.CaseData{},
		&entity.ToothNumber{},
		&entity.ToothPodition{},
		&entity.Treatment{},
		&entity.TreatmentTooth{},
	)

	//DentistMenagement
	db.AutoMigrate(&entity.DentistMenagement{})

	//Member
	db.AutoMigrate(&entity.Member{},
		&entity.Role{},
		&entity.MemberRole{},
	)

	//Patient
	db.AutoMigrate(&entity.Patient{},
		&entity.ContactPerson{},
		&entity.Address{},
		&entity.InitialSymptomps{},
		&entity.InitialSymptomps{},
	)

	//Payment
	db.AutoMigrate(&entity.CouterService{},
		&entity.CashPayment{},
		&entity.OnlinePayment{},
		&entity.CreditCard{},
		&entity.Transaction{},
	)

	//PeesonalData
	db.AutoMigrate(&entity.PersonalData{},
		&entity.Department{},
	)

	//Queue
	db.AutoMigrate(&entity.Queue{},
		&entity.Timeslot{},
	)

	//Room
	db.AutoMigrate(&entity.Room{},
		&entity.RoomReservation{},
	)

	//Service
	db.AutoMigrate(&entity.Service{},
		&entity.Promotion{},
		&entity.ServicePromotion{},
	)

	//StaffWorkTime
	db.AutoMigrate(&entity.Shifts{},
		&entity.Schedules{},
	)

	//Supply
	db.AutoMigrate(&entity.Supply{},
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
