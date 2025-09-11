package routers

import (
	 bookingController"Database/controllers/booking"
	"github.com/gin-gonic/gin"
)

func QueueRouter(router *gin.RouterGroup) {
	// Queue settings / capacity
	router.POST("/queue/slots", bookingController.CreateSlots)   // admin
	router.GET("/queue/slots", bookingController.GetSlotsByDate) // admin/view
	router.GET("/queue/capacity", bookingController.GetCapacitySummaryByDate)
	router.DELETE("/queue/slots/:id", bookingController.DeleteQueueSlot)
	router.PATCH("/queue/slots/:id", bookingController.UpdateQueueSlot)

	// Booking
	router.POST("/bookings", bookingController.CreateBooking)
	router.POST("/bookings/:id/cancel", bookingController.CancelBookingByID)
	router.GET("/bookings", bookingController.GetBookingsByDate)

	// New search routes
	router.GET("/bookings/search-by-phone", bookingController.SearchBookingsByPhone)
	// router.GET("/bookings/search-by-date", bookingController.SearchBookingsByDate)
	// router.GET("/bookings/search-combined", bookingController.SearchBookingsByPhoneAndDate)
}
