package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"Database/configs"
	"Database/entity"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// PaymentRequest represents the payment request from frontend
type PaymentRequest struct {
	Amount        float64 `json:"amount" binding:"required,min=1"`
	PaymentMethod string  `json:"paymentMethod" binding:"required,oneof=cash promptpay credit_card"`
	Reference     string  `json:"reference,omitempty"`
	
	// Cash payment specific
	CashReceived  float64 `json:"cashReceived,omitempty"`
	
	// Credit card specific
	CardNumber    string  `json:"cardNumber,omitempty"`
	CardType      string  `json:"cardType,omitempty"`
	ExpiryDate    string  `json:"expiryDate,omitempty"`
	CVV           string  `json:"cvv,omitempty"`
	
	// Optional patient ID
	PatientID     *uint   `json:"patientId,omitempty"`
}

// PaymentResponse represents the payment response to frontend
type PaymentResponse struct {
	TransactionID string    `json:"transactionId"`
	Status        string    `json:"status"`
	Amount        float64   `json:"amount"`
	PaymentMethod string    `json:"paymentMethod"`
	Timestamp     time.Time `json:"timestamp"`
	Reference     string    `json:"reference,omitempty"`
	Change        float64   `json:"change,omitempty"`
	Message       string    `json:"message"`
}

// ProcessPayment handles payment processing
func ProcessPayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	// Generate unique transaction ID
	transactionID := uuid.New().String()

	// Create base transaction
	transaction := entity.Transaction{
		TransactionID: transactionID,
		Timestamp:     time.Now(),
		Amount:        req.Amount,
		Currency:      "THB",
		PaymentMethod: req.PaymentMethod,
		Status:        "pending",
		Reference:     req.Reference,
		PatientID:     req.PatientID,
	}

	var response PaymentResponse

	// Process based on payment method
	switch req.PaymentMethod {
	case "cash":
		response = processCashPayment(&transaction, req)
	case "promptpay":
		response = processPromptPayPayment(&transaction, req)
	case "credit_card":
		response = processCreditCardPayment(&transaction, req)
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unsupported payment method",
		})
		return
	}

	// Save transaction to database
	if err := configs.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save transaction",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func processCashPayment(transaction *entity.Transaction, req PaymentRequest) PaymentResponse {
	// Validate cash received
	if req.CashReceived < req.Amount {
		transaction.Status = "failed"
		return PaymentResponse{
			TransactionID: transaction.TransactionID,
			Status:        "failed",
			Amount:        req.Amount,
			PaymentMethod: "cash",
			Timestamp:     transaction.Timestamp,
			Message:       "Insufficient cash received",
		}
	}

	// Create cash payment record
	cashPayment := entity.CashPayment{
		CashReceivesAmount: int(req.CashReceived * 100), // Store as cents
		ChangeGiven:        int((req.CashReceived - req.Amount) * 100),
	}

	if err := configs.DB.Create(&cashPayment).Error; err != nil {
		transaction.Status = "failed"
		return PaymentResponse{
			TransactionID: transaction.TransactionID,
			Status:        "failed",
			Amount:        req.Amount,
			PaymentMethod: "cash",
			Timestamp:     transaction.Timestamp,
			Message:       "Failed to process cash payment",
		}
	}

	transaction.CashPaymentID = &cashPayment.ID
	transaction.Status = "completed"

	return PaymentResponse{
		TransactionID: transaction.TransactionID,
		Status:        "completed",
		Amount:        req.Amount,
		PaymentMethod: "cash",
		Timestamp:     transaction.Timestamp,
		Change:        req.CashReceived - req.Amount,
		Message:       "Cash payment processed successfully",
	}
}

func processPromptPayPayment(transaction *entity.Transaction, req PaymentRequest) PaymentResponse {
	// Create online payment record
	onlinePayment := entity.OnlinePayment{
		OnlinePaymentProvider: "PromptPay",
		BankkAccountNumber:    "0643070129", // Your PromptPay ID
		QRCodemageURL:        "/promtpayqrcode.jpeg",
		Bank:                 "SCB",
	}

	if err := configs.DB.Create(&onlinePayment).Error; err != nil {
		transaction.Status = "failed"
		return PaymentResponse{
			TransactionID: transaction.TransactionID,
			Status:        "failed",
			Amount:        req.Amount,
			PaymentMethod: "promptpay",
			Timestamp:     transaction.Timestamp,
			Message:       "Failed to create PromptPay payment record",
		}
	}

	transaction.OnlinePaymentID = &onlinePayment.ID
	
	// For PromptPay, we set as pending until confirmation
	// In real implementation, you would integrate with bank API
	if req.Reference != "" {
		transaction.Status = "completed"
		transaction.Reference = req.Reference
	} else {
		transaction.Status = "pending"
	}

	status := transaction.Status
	message := "PromptPay payment initiated"
	if status == "completed" {
		message = "PromptPay payment completed"
	}

	return PaymentResponse{
		TransactionID: transaction.TransactionID,
		Status:        status,
		Amount:        req.Amount,
		PaymentMethod: "promptpay",
		Timestamp:     transaction.Timestamp,
		Reference:     req.Reference,
		Message:       message,
	}
}

func processCreditCardPayment(transaction *entity.Transaction, req PaymentRequest) PaymentResponse {
	// Basic validation (in real app, use proper payment gateway)
	if len(req.CardNumber) < 13 || req.CVV == "" || req.ExpiryDate == "" {
		transaction.Status = "failed"
		return PaymentResponse{
			TransactionID: transaction.TransactionID,
			Status:        "failed",
			Amount:        req.Amount,
			PaymentMethod: "credit_card",
			Timestamp:     transaction.Timestamp,
			Message:       "Invalid credit card information",
		}
	}

	// Create credit card record (store only last 4 digits)
	last4 := req.CardNumber[len(req.CardNumber)-4:]
	creditCard := entity.CreditCard{
		CardType:    req.CardType,
		Last4Digit:  last4,
		ExpiryDate:  req.ExpiryDate,
		IssuerBank:  "Unknown", // Would be determined by card number in real app
	}

	if err := configs.DB.Create(&creditCard).Error; err != nil {
		transaction.Status = "failed"
		return PaymentResponse{
			TransactionID: transaction.TransactionID,
			Status:        "failed",
			Amount:        req.Amount,
			PaymentMethod: "credit_card",
			Timestamp:     transaction.Timestamp,
			Message:       "Failed to process credit card payment",
		}
	}

	transaction.CreditCardID = &creditCard.ID
	transaction.Status = "completed" // In real app, this would be pending until gateway confirms

	return PaymentResponse{
		TransactionID: transaction.TransactionID,
		Status:        "completed",
		Amount:        req.Amount,
		PaymentMethod: "credit_card",
		Timestamp:     transaction.Timestamp,
		Message:       fmt.Sprintf("Credit card payment processed (****%s)", last4),
	}
}

// GetTransaction retrieves a transaction by ID
func GetTransaction(c *gin.Context) {
	transactionID := c.Param("id")
	
	var transaction entity.Transaction
	if err := configs.DB.Preload("CashPayment").Preload("OnlinePayment").Preload("CreditCard").
		Where("transaction_id = ?", transactionID).First(&transaction).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Transaction not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transaction": transaction,
	})
}

// ListTransactions retrieves all transactions with pagination
func ListTransactions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var transactions []entity.Transaction
	var total int64

	// Count total transactions
	configs.DB.Model(&entity.Transaction{}).Count(&total)

	// Get transactions with pagination
	if err := configs.DB.Preload("CashPayment").Preload("OnlinePayment").Preload("CreditCard").
		Offset(offset).Limit(limit).Order("created_at DESC").Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve transactions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transactions": transactions,
		"total":        total,
		"page":         page,
		"limit":        limit,
	})
}

// UpdateTransactionStatus updates transaction status (for PromptPay confirmations)
func UpdateTransactionStatus(c *gin.Context) {
	transactionID := c.Param("id")
	
	var req struct {
		Status    string `json:"status" binding:"required,oneof=completed failed cancelled"`
		Reference string `json:"reference,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}

	var transaction entity.Transaction
	if err := configs.DB.Where("transaction_id = ?", transactionID).First(&transaction).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Transaction not found",
		})
		return
	}

	// Update transaction
	transaction.Status = req.Status
	if req.Reference != "" {
		transaction.Reference = req.Reference
	}

	if err := configs.DB.Save(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update transaction",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction updated successfully",
		"transaction": transaction,
	})
}
