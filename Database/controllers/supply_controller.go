package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)

type SupplyPage struct {
	Items    []entity.Supply `json:"items"`
	Total    int64           `json:"total"`
	Page     int             `json:"page"`
	PageSize int             `json:"page_size"`
}

func ListSupplies(c *gin.Context) {
	// --------- อ่าน query ----------
	q := strings.TrimSpace(c.Query("q"))
	category := c.Query("category")      // "all" = ไม่กรอง
	importDate := c.Query("import_date") // YYYY-MM-DD
	expiryDate := c.Query("expiry_date")
	fmt.Println(category)
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 { page = 1 }
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if pageSize < 1 { pageSize = 10 }

	// map ชื่อ field ที่อนุญาตให้ sort
	sortBy := strings.ToLower(c.DefaultQuery("sort_by", "created_at"))
	order := strings.ToLower(c.DefaultQuery("order", "desc"))
	if order != "asc" && order != "desc" { order = "desc" }

	allowSort := map[string]string{
		"code":        "code",
		"name":        "name",
		"quantity":    "quantity",
		"import_date": "import_date",
		"expiry_date": "expiry_date",
		"created_at":  "created_at",
	}
	sortCol, ok := allowSort[sortBy]
	if !ok { sortCol = "created_at" }

	// --------- build query ----------
	tx := configs.DB.Model(&entity.Supply{})

	if q != "" {
		like := "%" + q + "%"
		tx = tx.Where("code LIKE ? OR name LIKE ?", like, like)
	}
	if category != "" && category != "all" {
		tx = tx.Where("category = ?", category)
	}
	// ใช้ date() เพื่อเทียบเฉพาะวัน (SQLite)
	if importDate != "" {
		tx = tx.Where("date(import_date) = date(?)", importDate)
	}
	if expiryDate != "" {
		tx = tx.Where("date(expiry_date) = date(?)", expiryDate)
	}

	var total int64
	if err := tx.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var items []entity.Supply
	if err := tx.
		Order(sortCol + " " + order).
		Offset((page-1)*pageSize).
		Limit(pageSize).
		Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, SupplyPage{
		Items:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	})
}

func DeleteSupply(c *gin.Context) {
	id := c.Param("id")
	if err := configs.DB.Delete(&entity.Supply{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// ----- สร้างเวชภัณฑ์ใหม่ -----
type CreateSupplyReq struct {
	Code       string `json:"code"        binding:"required"`
	Name       string `json:"name"        binding:"required"`
	Category   string `json:"category"    binding:"required"`
	Quantity   int    `json:"quantity"    binding:"required,min=0"`
	Unit       string `json:"unit"        binding:"required"`
	ImportDate string `json:"import_date" binding:"required"` // "YYYY-MM-DD"
	ExpiryDate string `json:"expiry_date" binding:"required"` // "YYYY-MM-DD"
}

func CreateSupply(c *gin.Context) {
	var req CreateSupplyReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	// ตรวจซ้ำรหัส (ถ้าอยากข้าม เช็คนี้ลบออกได้)
	var exist int64
	if err := configs.DB.Model(&entity.Supply{}).
		Where("code = ?", req.Code).
		Count(&exist).Error; err == nil && exist > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "รหัสเวชภัณฑ์นี้มีอยู่แล้ว"})
		return
	}

	// parse วันที่
	const layout = "2006-01-02"
	im, err := time.Parse(layout, req.ImportDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่นำเข้าไม่ถูกต้อง (ควรเป็น YYYY-MM-DD)"})
		return
	}
	ex, err := time.Parse(layout, req.ExpiryDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันหมดอายุไม่ถูกต้อง (ควรเป็น YYYY-MM-DD)"})
		return
	}

	s := entity.Supply{
		Code:       req.Code,
		Name:       req.Name,
		Category:   req.Category,
		Quantity:   req.Quantity,
		Unit:       req.Unit,
		ImportDate: im,
		ExpiryDate: ex,
	}

	if err := configs.DB.Create(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "บันทึกข้อมูลไม่สำเร็จ: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, s)
}



// -----------------------------------------------------------
// Supplies Handlers (list + delete)
// -----------------------------------------------------------

// listSupplies รองรับการค้นหา/กรอง/แบ่งหน้า/เรียง สำหรับหน้า AllSuppliesPage
// func listSupplies(c *gin.Context) {
// 	type SupplyDTO struct {
// 		ID         uint   `json:"id"`
// 		Code       string `json:"code"`
// 		Name       string `json:"name"`
// 		Category   string `json:"category"`
// 		Quantity   int    `json:"quantity"`
// 		Unit       string `json:"unit"`
// 		ImportDate string `json:"importDate"` // YYYY-MM-DD
// 		ExpiryDate string `json:"expiryDate"`
// 	}
// 	type pageResp struct {
// 		Items    []SupplyDTO `json:"items"`
// 		Total    int64       `json:"total"`
// 		Page     int         `json:"page"`
// 		PageSize int         `json:"page_size"`
// 	}

// 	q := strings.TrimSpace(c.Query("q"))
// 	category := c.Query("category")
// 	importDate := c.Query("import_date")
// 	expiryDate := c.Query("expiry_date")

// 	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
// 	if page < 1 {
// 		page = 1
// 	}
// 	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
// 	if pageSize < 1 {
// 		pageSize = 10
// 	}

// 	sortBy := c.DefaultQuery("sort_by", "created_at")
// 	order := strings.ToLower(c.DefaultQuery("order", "desc"))
// 	if order != "asc" && order != "desc" {
// 		order = "desc"
// 	}

// 	tx := db.Model(&entity.Supply{})

// 	if q != "" {
// 		like := "%" + q + "%"
// 		tx = tx.Where("name LIKE ? OR code LIKE ?", like, like)
// 	}
// 	if category != "" && category != "all" {
// 		tx = tx.Where("category = ?", category)
// 	}
// 	tx = tx.Where("import_date = ?", importDate)
// 	tx = tx.Where("expiry_date = ?", expiryDate)

// 	switch sortBy {
// 	case "code":
// 		tx = tx.Order("code " + order)
// 	case "name":
// 		tx = tx.Order("name " + order)
// 	case "quantity":
// 		tx = tx.Order("quantity " + order)
// 	case "import_date":
// 		tx = tx.Order("import_date " + order)
// 	case "expiry_date":
// 		tx = tx.Order("expiry_date " + order)
// 	default:
// 		tx = tx.Order("created_at " + order)
// 	}

// 	var total int64
// 	if err := tx.Count(&total).Error; err != nil {
// 		c.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	var rows []entity.Supply
// 	if err := tx.Offset((page - 1) * pageSize).Limit(pageSize).Find(&rows).Error; err != nil {
// 		c.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// map -> DTO (format วันที่เป็น YYYY-MM-DD)
// 	dtos := make([]SupplyDTO, 0, len(rows))
// 	for _, s := range rows {
// 		dto := SupplyDTO{
// 			ID:       s.ID,
// 			Code:     s.Code,
// 			Name:     s.Name,
// 			Category: s.Category,
// 			Quantity: s.Quantity,
// 			Unit:     s.Unit,
// 		}
// 		// ถ้า field เป็น time.Time
// 		if !s.ImportDate.IsZero() {
// 			dto.ImportDate = s.ImportDate.Format("2006-01-02")
// 		}
// 		if !s.ExpiryDate.IsZero() {
// 			dto.ExpiryDate = s.ExpiryDate.Format("2006-01-02")
// 		}
// 		// ถ้า field เป็น string อยู่แล้ว คุณสามารถกำหนดตรง ๆ:
// 		// dto.ImportDate = s.ImportDate
// 		// dto.ExpiryDate = s.ExpiryDate
// 		dtos = append(dtos, dto)
// 	}

// 	c.JSON(200, pageResp{
// 		Items:    dtos,
// 		Total:    total,
// 		Page:     page,
// 		PageSize: pageSize,
// 	})
// }

// ลบเวชภัณฑ์ตาม ID (ID จาก gorm.Model)
// func deleteSupply(c *gin.Context) {
// 	id := c.Param("id")
// 	if err := db.Delete(&entity.Supply{}, id).Error; err != nil {
// 		c.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.Status(204)
// }
