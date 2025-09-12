package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

// Payment represents the main payment record
type Payment struct {
	gorm.Model
	TransactionNumber string    `json:"transaction_number" gorm:"uniqueIndex;not null"`
	Amount           float64   `json:"amount" gorm:"not null"`
	PaymentMethod    string    `json:"payment_method" gorm:"not null"` // cash, credit_card, promptpay, bank_transfer
	Status           string    `json:"status" gorm:"default:pending"`  // pending, completed, failed, cancelled
	PaymentDate      time.Time `json:"payment_date"`
	Description      string    `json:"description"`
	
	// Patient information
	PatientID uint    `json:"patient_id"`
	Patient   Patient `json:"patient,omitempty" gorm:"foreignKey:PatientID;references:ID"`
	
	// Staff who processed the payment
	StaffID uint         `json:"staff_id"`
	Staff   PersonalData `json:"staff,omitempty" gorm:"foreignKey:StaffID;references:ID"`
	
	// Service information
	ServiceID uint    `json:"service_id"`
	Service   Service `json:"service,omitempty" gorm:"foreignKey:ServiceID;references:ID"`
	
	// Receipt relation (one-to-one)
	Receipt *Receipt `json:"receipt,omitempty" gorm:"foreignKey:PaymentID;references:ID"`
}

// Receipt represents payment receipt
type Receipt struct {
	gorm.Model
	ReceiptNumber string    `json:"receipt_number" gorm:"uniqueIndex;not null"`
	PaymentID     uint      `json:"payment_id" gorm:"not null"`
	Payment       *Payment   `json:"payment,omitempty" gorm:"foreignKey:PaymentID;references:ID"`
	IssueDate     time.Time `json:"issue_date"`
	Status        string    `json:"status" gorm:"default:issued"` // issued, cancelled, refunded
	
	// Business information
	BusinessName    string `json:"business_name" gorm:"default:Dental Clinic"`
	BusinessAddress string `json:"business_address" gorm:"default:123 Healthcare St, Bangkok 10110"`
	BusinessPhone   string `json:"business_phone" gorm:"default:02-123-4567"`
	BusinessTaxID   string `json:"business_tax_id" gorm:"default:0123456789012"`
	
	// Customer information
	CustomerName    string `json:"customer_name"`
	CustomerPhone   string `json:"customer_phone"`
	CustomerAddress string `json:"customer_address"`
	
	// Payment details
	SubTotal   float64 `json:"subtotal"`
	TaxAmount  float64 `json:"tax_amount"`
	TotalAmount float64 `json:"total_amount"`
	Notes      string  `json:"notes"`
	
	// Staff who issued the receipt
	IssuedByStaffID uint         `json:"issued_by_staff_id"`
	IssuedByStaff   PersonalData `json:"issued_by_staff,omitempty" gorm:"foreignKey:IssuedByStaffID;references:ID"`
}

// PaymentRequest for creating payments
type PaymentRequest struct {
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"payment_method" binding:"required,oneof=cash credit_card promptpay bank_transfer"`
	Description   string  `json:"description"`
	PatientID     uint    `json:"patient_id" binding:"required"`
	ServiceID     uint    `json:"service_id" binding:"required"`
	StaffID       uint    `json:"staff_id" binding:"required"`
}

// PaymentResponse for API responses
type PaymentResponse struct {
	ID                uint      `json:"id"`
	TransactionNumber string    `json:"transaction_number"`
	Amount           float64   `json:"amount"`
	PaymentMethod    string    `json:"payment_method"`
	Status           string    `json:"status"`
	PaymentDate      time.Time `json:"payment_date"`
	Description      string    `json:"description"`
	PatientName      string    `json:"patient_name,omitempty"`
	ServiceName      string    `json:"service_name,omitempty"`
	StaffName        string    `json:"staff_name,omitempty"`
	ReceiptNumber    string    `json:"receipt_number,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

// ReceiptRequest for creating receipts
type ReceiptRequest struct {
	PaymentID       uint    `json:"payment_id" binding:"required"`
	CustomerName    string  `json:"customer_name" binding:"required"`
	CustomerPhone   string  `json:"customer_phone"`
	CustomerAddress string  `json:"customer_address"`
	TaxAmount       float64 `json:"tax_amount"`
	Notes           string  `json:"notes"`
}

// ReceiptResponse for API responses
type ReceiptResponse struct {
	ID              uint      `json:"id"`
	ReceiptNumber   string    `json:"receipt_number"`
	PaymentID       uint      `json:"payment_id"`
	IssueDate       time.Time `json:"issue_date"`
	Status          string    `json:"status"`
	BusinessName    string    `json:"business_name"`
	BusinessAddress string    `json:"business_address"`
	BusinessPhone   string    `json:"business_phone"`
	BusinessTaxID   string    `json:"business_tax_id"`
	CustomerName    string    `json:"customer_name"`
	CustomerPhone   string    `json:"customer_phone"`
	CustomerAddress string    `json:"customer_address"`
	SubTotal        float64   `json:"subtotal"`
	TaxAmount       float64   `json:"tax_amount"`
	TotalAmount     float64   `json:"total_amount"`
	Notes           string    `json:"notes"`
	PaymentDetails  PaymentResponse `json:"payment_details,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
}

// Generate transaction number
func (p *Payment) GenerateTransactionNumber() {
	if p.TransactionNumber == "" {
		timestamp := time.Now().Format("20060102")
		p.TransactionNumber = fmt.Sprintf("TXN%s%X", timestamp, time.Now().UnixNano())
	}
}

// Generate receipt number
func (r *Receipt) GenerateReceiptNumber() {
	if r.ReceiptNumber == "" {
		timestamp := time.Now().Format("20060102")
		r.ReceiptNumber = fmt.Sprintf("RCP%s%X", timestamp, time.Now().UnixNano()&0xFFFFFF)
	}
}
