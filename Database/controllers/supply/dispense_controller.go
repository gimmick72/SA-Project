// Supply
package controllers

import (
	"net/http"
	"time"
	"strconv"
	"strings"
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

type DispenseReportItem struct {
    ID          uint      `json:"id"`
    RecordedAt  time.Time `json:"recorded_at"`
    Action      string    `json:"action"`
    SupplyID    uint      `json:"supply_id"`
    SupplyCode  string    `json:"supply_code"`
    SupplyName  string    `json:"supply_name"`
    Category    string    `json:"category"`
    Quantity    int       `json:"quantity"`
    CaseCode    string    `json:"case_code"`
    Dispenser   string    `json:"dispenser"`
}

type DispenseReportPage struct {
    Items    []DispenseReportItem `json:"items"`
    Total    int64                `json:"total"`
    Page     int                  `json:"page"`
    PageSize int                  `json:"page_size"`
}

func ListDispenses(c *gin.Context) {
    q := strings.TrimSpace(c.Query("q")) // ค้นหา code/name/case/dispenser
    dateFrom := c.Query("date_from")     // YYYY-MM-DD (optional)
    dateTo := c.Query("date_to")         // YYYY-MM-DD (optional)

    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    if page < 1 { page = 1 }
    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
    if pageSize < 1 { pageSize = 10 }

    sortBy := strings.ToLower(c.DefaultQuery("sort_by", "recorded_at")) // recorded_at|supply_code|supply_name|quantity|dispenser|case_code
    order := strings.ToLower(c.DefaultQuery("order", "desc"))
    if order != "asc" && order != "desc" { order = "desc" }

    // map column ปลอดภัย
    allowed := map[string]string{
        "recorded_at": "record_supplies.recorded_at",
        "supply_code": "supplies.code",
        "supply_name": "supplies.name",
        "quantity":    "record_supplies.quantity",
        "dispenser":   "record_supplies.dispenser",
        "case_code":   "record_supplies.case_code",
    }
    col, ok := allowed[sortBy]
    if !ok { col = "record_supplies.recorded_at" }

    // join record_supplies กับ supplies
    tx := configs.DB.Table("record_supplies").
        Select(`
            record_supplies.id AS id,
            record_supplies.recorded_at,
            record_supplies.action,
            record_supplies.supply_id,
            supplies.code AS supply_code,
            supplies.name AS supply_name,
            supplies.category AS category,
            record_supplies.quantity,
            record_supplies.case_code,
            record_supplies.dispenser
        `).
        Joins("LEFT JOIN supplies ON supplies.id = record_supplies.supply_id")

    if q != "" {
        like := "%" + q + "%"
        tx = tx.Where(`
            supplies.code LIKE ? OR
            supplies.name LIKE ? OR
            record_supplies.case_code LIKE ? OR
            record_supplies.dispenser LIKE ?
        `, like, like, like, like)
    }

    // ช่วงวันที่ (เทียบเฉพาะวัน)
    if dateFrom != "" {
        tx = tx.Where("date(record_supplies.recorded_at) >= date(?)", dateFrom)
    }
    if dateTo != "" {
        tx = tx.Where("date(record_supplies.recorded_at) <= date(?)", dateTo)
    }

    var total int64
    if err := tx.Count(&total).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var rows []DispenseReportItem
    if err := tx.
        Order(col + " " + order).
        Offset((page-1)*pageSize).
        Limit(pageSize).
        Scan(&rows).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, DispenseReportPage{
        Items:    rows,
        Total:    total,
        Page:     page,
        PageSize: pageSize,
    })
}