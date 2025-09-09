package entity

import (
	"time"
	"gorm.io/gorm"
)

type CouterService struct{
	gorm.Model
	FirstName string
	LastName string
}

type CashPayment struct{
	gorm.Model
	CashReceivesAmount int
	ChangeGiven int

	CouterServiceID uint
	CouterService CouterService
}

type OnlinePayment struct{
	gorm.Model
	OnlinePaymentProvider string
	BankkAccountNumber string
	QRCodemageURL string
	Bank string
}

type CreditCard struct{
	gorm.Model
	CardType string
	Last4Digit string
	ExpiryDate string
	IssuerBank string
}

type Transaction struct{
	gorm.Model
	Timesstamp time.Time
	Amount float32
	Currency string
	PaymentMethod string
	Status string

	OnlinePaymentID uint
	OnlinePayment OnlinePayment

	CreditCardID uint
	CreditCard CreditCard

	CashPaymentID uint
	CashPayment CashPayment

	PatientID uint
	Patient Patient // Define the Patient type above this line
}

type Patient struct {
	gorm.Model
	Name string
	Age  int
}
