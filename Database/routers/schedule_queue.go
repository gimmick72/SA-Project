package routers

import (
	"Database/controllers/room_queue"
	"github.com/gin-gonic/gin"

)

func Schedule_QueueRouter(router *gin.RouterGroup) {
	router.GET("/schedule", controllers.GetSchedule)
	router.POST("/schedule/assign", controllers.AssignSchedule)
}
