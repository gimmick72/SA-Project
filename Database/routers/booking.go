package routers

import (
	bookingController "Database/controllers/booking"
	"github.com/gin-gonic/gin"
)

func BookingRouter(router *gin.RouterGroup) {
	router.POST("/bookings", bookingController.CreateBooking)
	router.POST("/bookings/:id/cancel", bookingController.CancelBookingByID)
	router.GET("/bookings", bookingController.GetBookingsByDate)

}
