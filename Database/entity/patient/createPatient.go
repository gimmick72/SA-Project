// controllers/dto.go
package patientEntity

type CreateContactPersonDTO struct {
	Relationship       string `json:"relationship"`
	ContactpersonPhone string `json:"contactpersonphone"`
}

type CreateAddressDTO struct {
	HouseNumber string `json:"housenumber"`
	Moo         string `json:"moo"`
	Subdistrict string `json:"subdistrict"`
	District    string `json:"district"`
	Province    string `json:"province"`
	Postcode    string `json:"postcode"`
}

type CreatePatientDTO struct {
	CitizenID        string  `json:"citizenID" binding:"required,len=13"`
	Prefix           string  `json:"prefix" binding:"required"`
	Firstname        string  `json:"firstname" binding:"required"`
	Lastname         string  `json:"lastname" binding:"required"`
	Nickname         string  `json:"nickname" binding:"required"`
	CongenitaDisease string  `json:"congenitadisease" binding:"required"`
	BloodType        string  `json:"blood_type" binding:"required"`
	Gender           string  `json:"gender" binding:"required,oneof=male female"`
	Birthday         string  `json:"birthday" binding:"required"` // YYYY-MM-DD
	PhoneNumber      string  `json:"phonenumber" binding:"required"`
	Age              int     `json:"age" binding:"required,gte=0"`
	DrugAllergy      string  `json:"drugallergy"`
	ContactPerson    *CreateContactPersonDTO `json:"contactperson"`
	Address          *CreateAddressDTO       `json:"address"`
}
