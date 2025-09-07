package controllers

import (
	"crypto/rand"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"Database/entity"
)

type PaymentController struct {
	db *gorm.DB
}

func NewPaymentController(db *gorm.DB) *PaymentController {
	return &PaymentController{db: db}
}

// generateTransactionID generates a unique transaction ID
func (pc *PaymentController) generateTransactionID() string {
	timestamp := time.Now().Unix()
	randomBytes := make([]byte, 4)
	rand.Read(randomBytes)
	return fmt.Sprintf("TXN%d%X", timestamp, randomBytes)
}

// ProcessPayment handles payment processing
func (pc *PaymentController) ProcessPayment(c *gin.Context) {
	var req entity.PaymentRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request data: " + err.Error(),
		})
		return
	}

	// Create payment record
	payment := entity.Payment{
		TransactionID: pc.generateTransactionID(),
		Amount:        req.Amount,
		Currency:      "THB",
		PaymentMethod: req.PaymentMethod,
		Status:        "pending",
		Reference:     req.Reference,
		Timestamp:     time.Now(),
		PatientID:     req.PatientID,
		CounterStaffID: req.StaffID,
	}

	// Process based on payment method
	switch req.PaymentMethod {
	case "cash":
		if err := pc.processCashPayment(&payment, &req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}
	case "credit_card":
		if err := pc.processCreditCardPayment(&payment, &req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}
	case "promptpay":
		if err := pc.processPromptPayPayment(&payment, &req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Unsupported payment method",
		})
		return
	}

	// Save payment to database
	if err := pc.db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to save payment: " + err.Error(),
		})
		return
	}

	// Generate receipt for completed payments
	var receiptNumber string
	var receiptID *uint
	if payment.Status == "completed" {
		receipt, err := pc.generateReceipt(payment.ID, nil)
		if err != nil {
			// Log error but don't fail the payment
			fmt.Printf("Failed to generate receipt: %v\n", err)
		} else {
			receiptNumber = receipt.ReceiptNumber
			receiptID = &receipt.ID
			
			// Update payment with receipt reference
			payment.ReceiptID = receiptID
			pc.db.Save(&payment)
		}
	}

	// Prepare response
	response := entity.PaymentResponse{
		Success:       true,
		Message:       "Payment processed successfully",
		TransactionID: payment.TransactionID,
		Status:        payment.Status,
		Amount:        payment.Amount,
		Timestamp:     payment.Timestamp,
		ReceiptNumber: receiptNumber,
		ReceiptID:     receiptID,
	}

	// Add method-specific response data
	if payment.PaymentMethod == "cash" && payment.ChangeGiven != nil {
		response.Change = payment.ChangeGiven
	}
	if payment.PaymentMethod == "promptpay" && payment.QRCodeURL != "" {
		response.QRCodeURL = payment.QRCodeURL
	}

	c.JSON(http.StatusOK, response)
}

// processCashPayment handles cash payment logic
func (pc *PaymentController) processCashPayment(payment *entity.Payment, req *entity.PaymentRequest) error {
	if req.CashReceived == nil {
		req.CashReceived = &req.Amount
	}

	if *req.CashReceived < req.Amount {
		return fmt.Errorf("insufficient cash received: %.2f, required: %.2f", *req.CashReceived, req.Amount)
	}

	payment.CashReceived = req.CashReceived
	change := *req.CashReceived - req.Amount
	payment.ChangeGiven = &change
	payment.Status = "completed"

	return nil
}

// processCreditCardPayment handles credit card payment logic
func (pc *PaymentController) processCreditCardPayment(payment *entity.Payment, req *entity.PaymentRequest) error {
	if req.CardNumber == "" || req.ExpiryDate == "" || req.CVV == "" {
		return fmt.Errorf("missing required credit card information")
	}

	// Mask card number (keep only last 4 digits)
	if len(req.CardNumber) >= 4 {
		payment.Last4Digits = req.CardNumber[len(req.CardNumber)-4:]
		payment.CardNumber = strings.Repeat("*", len(req.CardNumber)-4) + payment.Last4Digits
	}

	payment.CardType = req.CardType
	payment.CardHolder = req.CardHolder
	payment.ExpiryDate = req.ExpiryDate

	// Simulate credit card processing
	// In real implementation, you would integrate with payment gateway
	payment.Status = "completed"

	return nil
}

// processPromptPayPayment handles PromptPay payment logic
func (pc *PaymentController) processPromptPayPayment(payment *entity.Payment, req *entity.PaymentRequest) error {
	if req.PhoneNumber == "" {
		return fmt.Errorf("phone number is required for PromptPay payment")
	}

	payment.PhoneNumber = req.PhoneNumber
	
	// Generate QR code URL (in real implementation, integrate with PromptPay API)
	payment.QRCodeURL = fmt.Sprintf("https://promptpay.io/%s/%.2f", req.PhoneNumber, req.Amount)
	
	// PromptPay payments start as pending until confirmed
	payment.Status = "pending"

	return nil
}

// GetTransaction retrieves a transaction by ID
func (pc *PaymentController) GetTransaction(c *gin.Context) {
	transactionID := c.Param("id")
	
	var payment entity.Payment
	if err := pc.db.Preload("Patient").Preload("CounterStaff").First(&payment, "transaction_id = ?", transactionID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Transaction not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"transaction": payment,
	})
}

// ListTransactions retrieves transactions with pagination
func (pc *PaymentController) ListTransactions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var payments []entity.Payment
	var total int64

	// Get total count
	pc.db.Model(&entity.Payment{}).Count(&total)

	// Get paginated results
	if err := pc.db.Preload("Patient").Preload("CounterStaff").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"transactions": payments,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// UpdateTransactionStatus updates transaction status (for PromptPay confirmations)
func (pc *PaymentController) UpdateTransactionStatus(c *gin.Context) {
	transactionID := c.Param("id")
	
	var req struct {
		Status    string `json:"status" binding:"required,oneof=completed failed cancelled"`
		Reference string `json:"reference,omitempty"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request data: " + err.Error(),
		})
		return
	}

	var payment entity.Payment
	if err := pc.db.First(&payment, "transaction_id = ?", transactionID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Transaction not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error: " + err.Error(),
		})
		return
	}

	// Update status and reference
	payment.Status = req.Status
	if req.Reference != "" {
		payment.Reference = req.Reference
	}

	if err := pc.db.Save(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update transaction: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"message":     "Transaction status updated successfully",
		"transaction": payment,
	})
}

// GetPaymentStats returns payment statistics
func (pc *PaymentController) GetPaymentStats(c *gin.Context) {
	var stats struct {
		TotalTransactions int64   `json:"totalTransactions"`
		TotalAmount       float64 `json:"totalAmount"`
		CompletedCount    int64   `json:"completedCount"`
		PendingCount      int64   `json:"pendingCount"`
		FailedCount       int64   `json:"failedCount"`
		CashCount         int64   `json:"cashCount"`
		CreditCardCount   int64   `json:"creditCardCount"`
		PromptPayCount    int64   `json:"promptPayCount"`
	}

	// Get total transactions and amount
	pc.db.Model(&entity.Payment{}).Count(&stats.TotalTransactions)
	pc.db.Model(&entity.Payment{}).Select("COALESCE(SUM(amount), 0)").Row().Scan(&stats.TotalAmount)

	// Get counts by status
	pc.db.Model(&entity.Payment{}).Where("status = ?", "completed").Count(&stats.CompletedCount)
	pc.db.Model(&entity.Payment{}).Where("status = ?", "pending").Count(&stats.PendingCount)
	pc.db.Model(&entity.Payment{}).Where("status = ?", "failed").Count(&stats.FailedCount)

	// Get counts by payment method
	pc.db.Model(&entity.Payment{}).Where("payment_method = ?", "cash").Count(&stats.CashCount)
	pc.db.Model(&entity.Payment{}).Where("payment_method = ?", "credit_card").Count(&stats.CreditCardCount)
	pc.db.Model(&entity.Payment{}).Where("payment_method = ?", "promptpay").Count(&stats.PromptPayCount)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"stats":   stats,
	})
}

// generateReceiptNumber generates a unique receipt number
func (pc *PaymentController) generateReceiptNumber() string {
	timestamp := time.Now().Format("20060102")
	randomBytes := make([]byte, 3)
	rand.Read(randomBytes)
	return fmt.Sprintf("RCP%s%X", timestamp, randomBytes)
}

// generateReceipt creates a receipt for a payment
func (pc *PaymentController) generateReceipt(paymentID uint, req *entity.ReceiptRequest) (*entity.Receipt, error) {
	// Get payment details
	var payment entity.Payment
	if err := pc.db.Preload("Patient").Preload("CounterStaff").First(&payment, paymentID).Error; err != nil {
		return nil, fmt.Errorf("payment not found: %v", err)
	}

	// Create receipt
	receipt := entity.Receipt{
		ReceiptNumber: pc.generateReceiptNumber(),
		PaymentID:     paymentID,
		IssueDate:     time.Now(),
		Subtotal:      payment.Amount,
		TotalAmount:   payment.Amount,
		Status:        "issued",
	}

	// Set default values or use request data
	if req != nil {
		if req.CustomerName != "" {
			receipt.CustomerName = req.CustomerName
		}
		if req.CustomerPhone != "" {
			receipt.CustomerPhone = req.CustomerPhone
		}
		if req.CustomerAddress != "" {
			receipt.CustomerAddress = req.CustomerAddress
		}
		if req.Description != "" {
			receipt.Description = req.Description
		}
		if req.TaxAmount > 0 {
			receipt.TaxAmount = req.TaxAmount
			receipt.TotalAmount = receipt.Subtotal + receipt.TaxAmount
		}
		if req.IssuedByStaffID != nil {
			receipt.IssuedByStaffID = req.IssuedByStaffID
		}
		if req.Notes != "" {
			receipt.Notes = req.Notes
		}
	}

	// Use patient info if available and not overridden
	if payment.Patient != nil && receipt.CustomerName == "" {
		receipt.CustomerName = fmt.Sprintf("%s %s", payment.Patient.FirstName, payment.Patient.LastName)
		receipt.CustomerPhone = payment.Patient.PhoneNumber
	}

	// Use counter staff if available and not overridden
	if payment.CounterStaff != nil && receipt.IssuedByStaffID == nil {
		receipt.IssuedByStaffID = &payment.CounterStaff.ID
	}

	// Save receipt to database
	if err := pc.db.Create(&receipt).Error; err != nil {
		return nil, fmt.Errorf("failed to create receipt: %v", err)
	}

	// Preload relations for response
	if err := pc.db.Preload("Payment").Preload("IssuedByStaff").First(&receipt, receipt.ID).Error; err != nil {
		return nil, fmt.Errorf("failed to load receipt relations: %v", err)
	}

	return &receipt, nil
}

// GenerateReceipt creates a receipt for an existing payment
// POST /api/receipts
func (pc *PaymentController) GenerateReceipt(c *gin.Context) {
	var req entity.ReceiptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request data: " + err.Error(),
		})
		return
	}

	receipt, err := pc.generateReceipt(req.PaymentID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	response := entity.ReceiptResponse{
		Success:       true,
		Message:       "Receipt generated successfully",
		ReceiptNumber: receipt.ReceiptNumber,
		ReceiptID:     receipt.ID,
		IssueDate:     receipt.IssueDate,
		Receipt:       receipt,
	}

	c.JSON(http.StatusCreated, response)
}

// GetReceipt retrieves a receipt by receipt number or ID
// GET /api/receipts/:id
func (pc *PaymentController) GetReceipt(c *gin.Context) {
	receiptID := c.Param("id")
	
	var receipt entity.Receipt
	var err error
	
	// Try to find by receipt number first, then by ID
	err = pc.db.Preload("Payment").Preload("IssuedByStaff").Where("receipt_number = ?", receiptID).First(&receipt).Error
	if err == gorm.ErrRecordNotFound {
		// Try by ID
		err = pc.db.Preload("Payment").Preload("IssuedByStaff").First(&receipt, receiptID).Error
	}
	
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Receipt not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"receipt": receipt,
	})
}

// ListReceipts retrieves receipts with pagination and filtering
// GET /api/receipts
func (pc *PaymentController) ListReceipts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	status := c.Query("status")
	customerName := c.Query("customer_name")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	offset := (page - 1) * pageSize

	query := pc.db.Model(&entity.Receipt{}).Preload("Payment").Preload("IssuedByStaff")

	// Apply filters
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if customerName != "" {
		query = query.Where("customer_name LIKE ?", "%"+customerName+"%")
	}
	if startDate != "" {
		query = query.Where("issue_date >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("issue_date <= ?", endDate)
	}

	// Count total records
	var total int64
	query.Count(&total)

	// Get receipts
	var receipts []entity.Receipt
	if err := query.Order("issue_date DESC").Offset(offset).Limit(pageSize).Find(&receipts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch receipts: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"receipts":    receipts,
			"total":       total,
			"page":        page,
			"page_size":   pageSize,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// CancelReceipt cancels a receipt
// PUT /api/receipts/:id/cancel
func (pc *PaymentController) CancelReceipt(c *gin.Context) {
	receiptID := c.Param("id")
	
	var receipt entity.Receipt
	if err := pc.db.First(&receipt, receiptID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Receipt not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database error: " + err.Error(),
		})
		return
	}

	if receipt.Status == "cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Receipt is already cancelled",
		})
		return
	}

	receipt.Status = "cancelled"
	if err := pc.db.Save(&receipt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to cancel receipt: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Receipt cancelled successfully",
		"receipt": receipt,
	})
}
