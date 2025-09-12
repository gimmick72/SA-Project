package controllers

import (
	"net/http"
	"strconv"
	"time"

	"Database/configs"
	"Database/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreatePayment creates a new payment record
func CreatePayment(c *gin.Context) {
	var req entity.PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Create payment record
	payment := entity.Payment{
		Amount:        req.Amount,
		PaymentMethod: req.PaymentMethod,
		Description:   req.Description,
		PatientID:     req.PatientID,
		ServiceID:     req.ServiceID,
		StaffID:       req.StaffID,
		PaymentDate:   time.Now(),
		Status:        "completed",
	}

	// Generate transaction number
	payment.GenerateTransactionNumber()

	// Save payment
	if err := configs.DB.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment", "details": err.Error()})
		return
	}

	// Auto-generate receipt for cash payments
	if payment.PaymentMethod == "cash" {
		receipt := entity.Receipt{
			PaymentID:   payment.ID,
			IssueDate:   time.Now(),
			SubTotal:    payment.Amount,
			TaxAmount:   payment.Amount * 0.07, // 7% VAT
			TotalAmount: payment.Amount + (payment.Amount * 0.07),
			Status:      "issued",
			IssuedByStaffID: payment.StaffID,
		}
		receipt.GenerateReceiptNumber()
		configs.DB.Create(&receipt)
	}

	// Load relations for response
	configs.DB.Preload("Patient").Preload("Service").Preload("Staff").Preload("Receipt").First(&payment, payment.ID)

	// Create response
	response := entity.PaymentResponse{
		ID:                payment.ID,
		TransactionNumber: payment.TransactionNumber,
		Amount:           payment.Amount,
		PaymentMethod:    payment.PaymentMethod,
		Status:           payment.Status,
		PaymentDate:      payment.PaymentDate,
		Description:      payment.Description,
		CreatedAt:        payment.CreatedAt,
	}

	if payment.Patient.ID != 0 {
		response.PatientName = payment.Patient.FirstName + " " + payment.Patient.LastName
	}
	if payment.Service.ID != 0 {
		response.ServiceName = payment.Service.NameService
	}
	if payment.Staff.ID != 0 {
		response.StaffName = payment.Staff.FirstName + " " + payment.Staff.LastName
	}
	if payment.Receipt != nil {
		response.ReceiptNumber = payment.Receipt.ReceiptNumber
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Payment created successfully",
		"data":    response,
	})
}

// GetPayments retrieves all payments with pagination
func GetPayments(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	status := c.Query("status")
	paymentMethod := c.Query("payment_method")

	offset := (page - 1) * pageSize

	var payments []entity.Payment
	var total int64

	query := configs.DB.Model(&entity.Payment{})

	// Apply filters
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if paymentMethod != "" {
		query = query.Where("payment_method = ?", paymentMethod)
	}

	// Get total count
	query.Count(&total)

	// Get payments with relations
	if err := query.Preload("Patient").Preload("Service").Preload("Staff").Preload("Receipt").
		Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payments", "details": err.Error()})
		return
	}

	// Convert to response format
	var responses []entity.PaymentResponse
	for _, payment := range payments {
		response := entity.PaymentResponse{
			ID:                payment.ID,
			TransactionNumber: payment.TransactionNumber,
			Amount:           payment.Amount,
			PaymentMethod:    payment.PaymentMethod,
			Status:           payment.Status,
			PaymentDate:      payment.PaymentDate,
			Description:      payment.Description,
			CreatedAt:        payment.CreatedAt,
		}

		if payment.Patient.ID != 0 {
			response.PatientName = payment.Patient.FirstName + " " + payment.Patient.LastName
		}
		if payment.Service.ID != 0 {
			response.ServiceName = payment.Service.NameService
		}
		if payment.Staff.ID != 0 {
			response.StaffName = payment.Staff.FirstName + " " + payment.Staff.LastName
		}
		if payment.Receipt != nil {
			response.ReceiptNumber = payment.Receipt.ReceiptNumber
		}

		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": responses,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetPayment retrieves a specific payment by ID
func GetPayment(c *gin.Context) {
	id := c.Param("id")

	var payment entity.Payment
	if err := configs.DB.Preload("Patient").Preload("Service").Preload("Staff").Preload("Receipt").
		First(&payment, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payment", "details": err.Error()})
		return
	}

	// Create response
	response := entity.PaymentResponse{
		ID:                payment.ID,
		TransactionNumber: payment.TransactionNumber,
		Amount:           payment.Amount,
		PaymentMethod:    payment.PaymentMethod,
		Status:           payment.Status,
		PaymentDate:      payment.PaymentDate,
		Description:      payment.Description,
		CreatedAt:        payment.CreatedAt,
	}

	if payment.Patient.ID != 0 {
		response.PatientName = payment.Patient.FirstName + " " + payment.Patient.LastName
	}
	if payment.Service.ID != 0 {
		response.ServiceName = payment.Service.NameService
	}
	if payment.Staff.ID != 0 {
		response.StaffName = payment.Staff.FirstName + " " + payment.Staff.LastName
	}
	if payment.Receipt != nil {
		response.ReceiptNumber = payment.Receipt.ReceiptNumber
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// UpdatePayment updates a payment record
func UpdatePayment(c *gin.Context) {
	id := c.Param("id")

	var payment entity.Payment
	if err := configs.DB.First(&payment, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find payment", "details": err.Error()})
		return
	}

	var req entity.PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Update payment fields
	payment.Amount = req.Amount
	payment.PaymentMethod = req.PaymentMethod
	payment.Description = req.Description
	payment.PatientID = req.PatientID
	payment.ServiceID = req.ServiceID
	payment.StaffID = req.StaffID

	if err := configs.DB.Save(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment updated successfully"})
}

// DeletePayment deletes a payment record
func DeletePayment(c *gin.Context) {
	id := c.Param("id")

	var payment entity.Payment
	if err := configs.DB.First(&payment, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find payment", "details": err.Error()})
		return
	}

	// Delete associated receipt first
	configs.DB.Where("payment_id = ?", payment.ID).Delete(&entity.Receipt{})

	// Delete payment
	if err := configs.DB.Delete(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete payment", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment deleted successfully"})
}

// CreateReceipt creates a receipt for an existing payment
func CreateReceipt(c *gin.Context) {
	var req entity.ReceiptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Check if payment exists
	var payment entity.Payment
	if err := configs.DB.First(&payment, req.PaymentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find payment", "details": err.Error()})
		return
	}

	// Check if receipt already exists
	var existingReceipt entity.Receipt
	if err := configs.DB.Where("payment_id = ?", req.PaymentID).First(&existingReceipt).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Receipt already exists for this payment"})
		return
	}

	// Create receipt
	receipt := entity.Receipt{
		PaymentID:       req.PaymentID,
		IssueDate:       time.Now(),
		CustomerName:    req.CustomerName,
		CustomerPhone:   req.CustomerPhone,
		CustomerAddress: req.CustomerAddress,
		SubTotal:        payment.Amount,
		TaxAmount:       req.TaxAmount,
		TotalAmount:     payment.Amount + req.TaxAmount,
		Notes:           req.Notes,
		Status:          "issued",
		IssuedByStaffID: payment.StaffID,
	}

	receipt.GenerateReceiptNumber()

	if err := configs.DB.Create(&receipt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create receipt", "details": err.Error()})
		return
	}

	// Load relations for response
	configs.DB.Preload("Payment").Preload("IssuedByStaff").First(&receipt, receipt.ID)

	// Create response
	response := entity.ReceiptResponse{
		ID:              receipt.ID,
		ReceiptNumber:   receipt.ReceiptNumber,
		PaymentID:       receipt.PaymentID,
		IssueDate:       receipt.IssueDate,
		Status:          receipt.Status,
		BusinessName:    receipt.BusinessName,
		BusinessAddress: receipt.BusinessAddress,
		BusinessPhone:   receipt.BusinessPhone,
		BusinessTaxID:   receipt.BusinessTaxID,
		CustomerName:    receipt.CustomerName,
		CustomerPhone:   receipt.CustomerPhone,
		CustomerAddress: receipt.CustomerAddress,
		SubTotal:        receipt.SubTotal,
		TaxAmount:       receipt.TaxAmount,
		TotalAmount:     receipt.TotalAmount,
		Notes:           receipt.Notes,
		CreatedAt:       receipt.CreatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Receipt created successfully",
		"data":    response,
	})
}

// GetReceipts retrieves all receipts with pagination
func GetReceipts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	status := c.Query("status")

	offset := (page - 1) * pageSize

	var receipts []entity.Receipt
	var total int64

	query := configs.DB.Model(&entity.Receipt{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	query.Count(&total)

	if err := query.Preload("Payment").Preload("IssuedByStaff").
		Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&receipts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve receipts", "details": err.Error()})
		return
	}

	var responses []entity.ReceiptResponse
	for _, receipt := range receipts {
		response := entity.ReceiptResponse{
			ID:              receipt.ID,
			ReceiptNumber:   receipt.ReceiptNumber,
			PaymentID:       receipt.PaymentID,
			IssueDate:       receipt.IssueDate,
			Status:          receipt.Status,
			BusinessName:    receipt.BusinessName,
			BusinessAddress: receipt.BusinessAddress,
			BusinessPhone:   receipt.BusinessPhone,
			BusinessTaxID:   receipt.BusinessTaxID,
			CustomerName:    receipt.CustomerName,
			CustomerPhone:   receipt.CustomerPhone,
			CustomerAddress: receipt.CustomerAddress,
			SubTotal:        receipt.SubTotal,
			TaxAmount:       receipt.TaxAmount,
			TotalAmount:     receipt.TotalAmount,
			Notes:           receipt.Notes,
			CreatedAt:       receipt.CreatedAt,
		}
		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": responses,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetReceipt retrieves a specific receipt by ID or receipt number
func GetReceipt(c *gin.Context) {
	identifier := c.Param("id")

	var receipt entity.Receipt
	var err error

	// Try to find by ID first, then by receipt number
	if err = configs.DB.Preload("Payment").Preload("IssuedByStaff").First(&receipt, identifier).Error; err != nil {
		if err = configs.DB.Preload("Payment").Preload("IssuedByStaff").Where("receipt_number = ?", identifier).First(&receipt).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "Receipt not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve receipt", "details": err.Error()})
			return
		}
	}

	response := entity.ReceiptResponse{
		ID:              receipt.ID,
		ReceiptNumber:   receipt.ReceiptNumber,
		PaymentID:       receipt.PaymentID,
		IssueDate:       receipt.IssueDate,
		Status:          receipt.Status,
		BusinessName:    receipt.BusinessName,
		BusinessAddress: receipt.BusinessAddress,
		BusinessPhone:   receipt.BusinessPhone,
		BusinessTaxID:   receipt.BusinessTaxID,
		CustomerName:    receipt.CustomerName,
		CustomerPhone:   receipt.CustomerPhone,
		CustomerAddress: receipt.CustomerAddress,
		SubTotal:        receipt.SubTotal,
		TaxAmount:       receipt.TaxAmount,
		TotalAmount:     receipt.TotalAmount,
		Notes:           receipt.Notes,
		CreatedAt:       receipt.CreatedAt,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// CancelReceipt cancels a receipt
func CancelReceipt(c *gin.Context) {
	id := c.Param("id")

	var receipt entity.Receipt
	if err := configs.DB.First(&receipt, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Receipt not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find receipt", "details": err.Error()})
		return
	}

	receipt.Status = "cancelled"
	if err := configs.DB.Save(&receipt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel receipt", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Receipt cancelled successfully"})
}
