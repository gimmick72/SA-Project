package entity

import (
	"time"
	"gorm.io/gorm"
)

// Payment represents a payment transaction
type Payment struct {
	gorm.Model
	TransactionID    string    `json:"transaction_id" gorm:"uniqueIndex;not null"`
	Amount          float64   `json:"amount" gorm:"not null"`
	Currency        string    `json:"currency" gorm:"default:'THB'"`
	PaymentMethod   string    `json:"payment_method" gorm:"not null"` // cash, promptpay, credit_card
	Status          string    `json:"status" gorm:"default:'pending'"` // pending, completed, failed, cancelled
	Reference       string    `json:"reference,omitempty"`
	Timestamp       time.Time `json:"timestamp" gorm:"default:CURRENT_TIMESTAMP"`
	
	// Cash payment specific fields
	CashReceived    *float64  `json:"cash_received,omitempty"`
	ChangeGiven     *float64  `json:"change_given,omitempty"`
	
	// Credit card specific fields
	CardNumber      string    `json:"card_number,omitempty"`
	CardType        string    `json:"card_type,omitempty"`
	CardHolder      string    `json:"card_holder,omitempty"`
	ExpiryDate      string    `json:"expiry_date,omitempty"`
	Last4Digits     string    `json:"last_4_digits,omitempty"`
	
	// PromptPay specific fields
	PhoneNumber     string    `json:"phone_number,omitempty"`
	QRCodeURL       string    `json:"qr_code_url,omitempty"`
	
	// Relations
	PatientID       *uint     `json:"patient_id,omitempty"`
	Patient         *Patient  `json:"patient,omitempty" gorm:"foreignKey:PatientID"`
	CounterStaffID  *uint     `json:"counter_staff_id,omitempty"`
	CounterStaff    *Staff    `json:"counter_staff,omitempty" gorm:"foreignKey:CounterStaffID"`
	
	// Receipt relation
	ReceiptID       *uint     `json:"receipt_id,omitempty"`
	Receipt         *Receipt  `json:"receipt,omitempty" gorm:"foreignKey:ReceiptID"`
}

// Staff represents counter service staff
type Staff struct {
	gorm.Model
	FirstName   string `json:"first_name" gorm:"not null"`
	LastName    string `json:"last_name" gorm:"not null"`
	Email       string `json:"email" gorm:"uniqueIndex"`
	Position    string `json:"position"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
}

// PaymentRequest represents the request payload for processing payments
type PaymentRequest struct {
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"paymentMethod" binding:"required,oneof=cash promptpay credit_card"`
	Reference     string  `json:"reference,omitempty"`
	
	// Cash payment fields
	CashReceived  *float64 `json:"cashReceived,omitempty"`
	
	// Credit card fields
	CardNumber    string   `json:"cardNumber,omitempty"`
	CardType      string   `json:"cardType,omitempty"`
	CardHolder    string   `json:"cardHolder,omitempty"`
	ExpiryDate    string   `json:"expiryDate,omitempty"`
	CVV           string   `json:"cvv,omitempty"`
	
	// PromptPay fields
	PhoneNumber   string   `json:"phoneNumber,omitempty"`
	
	// Optional relations
	PatientID     *uint    `json:"patientId,omitempty"`
	StaffID       *uint    `json:"staffId,omitempty"`
}

// Receipt represents a payment receipt
type Receipt struct {
	gorm.Model
	ReceiptNumber   string    `json:"receipt_number" gorm:"uniqueIndex;not null"`
	PaymentID       uint      `json:"payment_id" gorm:"not null"`
	Payment         Payment   `json:"payment" gorm:"foreignKey:PaymentID"`
	IssueDate       time.Time `json:"issue_date" gorm:"default:CURRENT_TIMESTAMP"`
	
	// Business Information
	BusinessName    string    `json:"business_name" gorm:"default:'Dental Clinic'"`
	BusinessAddress string    `json:"business_address" gorm:"default:'123 Main St, Bangkok, Thailand'"`
	BusinessPhone   string    `json:"business_phone" gorm:"default:'+66-2-123-4567'"`
	TaxID           string    `json:"tax_id" gorm:"default:'1234567890123'"`
	
	// Customer Information
	CustomerName    string    `json:"customer_name,omitempty"`
	CustomerPhone   string    `json:"customer_phone,omitempty"`
	CustomerAddress string    `json:"customer_address,omitempty"`
	
	// Receipt Details
	Description     string    `json:"description" gorm:"default:'Dental Services'"`
	Subtotal        float64   `json:"subtotal" gorm:"not null"`
	TaxAmount       float64   `json:"tax_amount" gorm:"default:0"`
	TotalAmount     float64   `json:"total_amount" gorm:"not null"`
	
	// Staff Information
	IssuedByStaffID *uint     `json:"issued_by_staff_id,omitempty"`
	IssuedByStaff   *Staff    `json:"issued_by_staff,omitempty" gorm:"foreignKey:IssuedByStaffID"`
	
	// Receipt Status
	Status          string    `json:"status" gorm:"default:'issued'"` // issued, cancelled, refunded
	Notes           string    `json:"notes,omitempty"`
}

// ReceiptRequest represents the request payload for generating receipts
type ReceiptRequest struct {
	PaymentID       uint    `json:"payment_id" binding:"required"`
	CustomerName    string  `json:"customer_name,omitempty"`
	CustomerPhone   string  `json:"customer_phone,omitempty"`
	CustomerAddress string  `json:"customer_address,omitempty"`
	Description     string  `json:"description,omitempty"`
	TaxAmount       float64 `json:"tax_amount,omitempty"`
	IssuedByStaffID *uint   `json:"issued_by_staff_id,omitempty"`
	Notes           string  `json:"notes,omitempty"`
}

// ReceiptResponse represents the response after generating receipt
type ReceiptResponse struct {
	Success       bool      `json:"success"`
	Message       string    `json:"message"`
	ReceiptNumber string    `json:"receipt_number,omitempty"`
	ReceiptID     uint      `json:"receipt_id,omitempty"`
	IssueDate     time.Time `json:"issue_date"`
	Receipt       *Receipt  `json:"receipt,omitempty"`
}

// PaymentResponse represents the response after processing payment
type PaymentResponse struct {
	Success       bool      `json:"success"`
	Message       string    `json:"message"`
	TransactionID string    `json:"transactionId,omitempty"`
	Status        string    `json:"status"`
	Amount        float64   `json:"amount"`
	Change        *float64  `json:"change,omitempty"`
	QRCodeURL     string    `json:"qrCodeUrl,omitempty"`
	Timestamp     time.Time `json:"timestamp"`
	ReceiptNumber string    `json:"receiptNumber,omitempty"`
	ReceiptID     *uint     `json:"receiptId,omitempty"`
}