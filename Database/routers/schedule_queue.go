package routers

import (
    "github.com/gin-gonic/gin"
    roomqueue "Database/controllers/room_queue"
)

func Schedule_QueueRouter(api *gin.RouterGroup) {
    api.GET("/schedule", roomqueue.GetSchedule)
    api.POST("/schedule/assign", roomqueue.AssignSchedule)

    // ❗️ใช้ path ใหม่สำหรับคิวฝั่งซ้าย เพื่อไม่ชน CRUD /patients
    api.GET("/queue/patients", roomqueue.GetQueuePatients)
}
