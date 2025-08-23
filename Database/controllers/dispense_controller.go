// controllers/dispense.go
package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"Database/configs"
	"Database/entity"
)

type DispenseItem struct {
	SupplyCode string `json:"supply_code" binding:"required"`
	Quantity   int    `json:"quantity"    binding:"required,min=1"`
}

type CreateDispenseReq struct {
	CaseCode  string         `json:"case_code"  binding:"required"`
	Dispenser string         `json:"dispenser"  binding:"required"`
	Items     []DispenseItem `json:"items"      binding:"required,dive"`
}

type CreateDispenseResp struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func CreateDispense(c *gin.Context) {
	var req CreateDispenseReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	if len(req.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "items required"})
		return
	}

	err := configs.DB.Transaction(func(tx *gorm.DB) error {
		now := time.Now()

		for _, it := range req.Items {
			var s entity.Supply
			if err := tx.Where("code = ?", it.SupplyCode).First(&s).Error; err != nil {
				return err
			}
			// ตรวจสต็อกพอไหม
			if s.Quantity < it.Quantity {
				return gin.Error{Err:  &gin.Error{Err:  nil}, Type: gin.ErrorTypePublic, Meta: "สต็อกไม่พอสำหรับ " + s.Name}
			}
			// หักสต็อก
			if err := tx.Model(&s).UpdateColumn("quantity", gorm.Expr("quantity - ?", it.Quantity)).Error; err != nil {
				return err
			}
			// บันทึกประวัติ
			rec := entity.RecordSupply{
				Action:     "DISPENSE",
				SupplyID:   s.ID,
				Quantity:   it.Quantity,
				CaseCode:   req.CaseCode,
				Dispenser:  req.Dispenser,
				RecordedAt: now,
			}
			if err := tx.Create(&rec).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		// แปลง error ให้อ่านง่าย
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, CreateDispenseResp{
		Success: true,
		Message: "บันทึกการเบิกสำเร็จ",
	})
}
