package routers

import (
	paymentControllers "Database/controllers/payment"
	"Database/middlewares"

	"github.com/gin-gonic/gin"
)

func PaymentRouter(router *gin.RouterGroup) {
	paymentGroup := router.Group("/payments")
	{
		// Public routes (with authentication)
		paymentGroup.Use(middlewares.Authorizes())
		
		// Payment CRUD operations
		paymentGroup.POST("", paymentControllers.CreatePayment)
		paymentGroup.GET("", paymentControllers.GetPayments)
		paymentGroup.GET("/:id", paymentControllers.GetPayment)
		paymentGroup.PUT("/:id", paymentControllers.UpdatePayment)
		paymentGroup.DELETE("/:id", paymentControllers.DeletePayment)
	}

	receiptGroup := router.Group("/receipts")
	{
		// Receipt operations (with authentication)
		receiptGroup.Use(middlewares.Authorizes())
		
		receiptGroup.POST("", paymentControllers.CreateReceipt)
		receiptGroup.GET("", paymentControllers.GetReceipts)
		receiptGroup.GET("/:id", paymentControllers.GetReceipt)
		receiptGroup.PUT("/:id/cancel", paymentControllers.CancelReceipt)
	}
}
