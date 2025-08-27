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
	TransactionID string `gorm:"unique;not null"`
	Timestamp time.Time
	Amount float64
	Currency string `gorm:"default:THB"`
	PaymentMethod string // cash, promptpay, credit_card
	Status string `gorm:"default:pending"` // pending, completed, failed, cancelled
	Reference string // For PromptPay reference or transaction ref
	
	// Payment method specific IDs (nullable)
	OnlinePaymentID *uint
	OnlinePayment OnlinePayment

	CreditCardID *uint
	CreditCard CreditCard

	CashPaymentID *uint
	CashPayment CashPayment

	PatientID *uint
	Patient Patient
}