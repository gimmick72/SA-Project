package main
import ("gorm.io/gorm"
		"gorm.io/driver/sqlite"
		"Database/entity"
	)

func main() {
	db, err:= gorm.Open(sqlite.Open("DatabaseProject_SA.db"), &gorm.Config{})
	
	if err != nil {
		panic ("Failed to connect database")
	}

	//Create Tanle//
	// db.AutoMigrate(&entity.Service{}, &entity.DentistMenagement{})


	//Use for create Data mocup //
	//Insert Data
		db.Create(&entity.Service{
		NameService: "healty",
		DetailService: "xxxxxxxxxxxxxxxx",
		Cost: 100.00,
	})

}