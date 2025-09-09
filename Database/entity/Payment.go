package entity

import (
	"time"

	"gorm.io/gorm"
)

type CouterService struct {
	gorm.Model
	FirstName string
	LastName  string

	// One-to-Many: หนึ่ง CouterService มีได้หลาย CashPayment
	CashPayments []CashPayment `gorm:"foreignKey:CouterServiceID"`
}

type CashPayment struct {
	gorm.Model
	CashReceivesAmount int
	ChangeGiven        int

	CouterServiceID uint
	CouterService   CouterService `gorm:"foreignKey:CouterServiceID;references:ID"`
}

type OnlinePayment struct {
	gorm.Model
	OnlinePaymentProvider string
	BankAccountNumber     string
	QRCodeImageURL        string
	Bank                  string

	Transactions []Transaction `gorm:"foreignKey:OnlinePaymentID"`
}

type CreditCard struct {
	gorm.Model
	CardType   string
	Last4Digit string
	ExpiryDate string
	IssuerBank string

	Transactions []Transaction `gorm:"foreignKey:CreditCardID"`
}

type Transaction struct {
	gorm.Model
	Timestamp     time.Time
	Amount        float32
	Currency      string
	PaymentMethod string
	Status        string

	OnlinePaymentID uint
	OnlinePayment   OnlinePayment `gorm:"foreignKey:OnlinePaymentID;references:ID"`

	CreditCardID uint
	CreditCard   CreditCard `gorm:"foreignKey:CreditCardID;references:ID"`

	CashPaymentID uint
	CashPayment   CashPayment `gorm:"foreignKey:CashPaymentID;references:ID"`

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID;references:ID"`
}
