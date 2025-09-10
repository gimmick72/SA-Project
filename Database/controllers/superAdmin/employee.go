package controllers

// import (
// 	"net/http"
// 	"strconv"
// 	"strings"
// 	"time"

// 	"Database/configs"
// 	"Database/entity"

// 	"github.com/gin-gonic/gin"
// 	"golang.org/x/crypto/bcrypt"
// )

// // ---------- DTO ----------


// // ---------- helpers ----------
// func empToResp(e entity.Employee) EmployeeResp {
// 	return EmployeeResp{
// 		ID:        e.ID,
// 		FirstName: e.FirstName,
// 		LastName:  e.LastName,
// 		Username:  e.Username,
// 		Role:      e.Role,
// 		CreatedAt: e.CreatedAt.Format(time.RFC3339),
// 		UpdatedAt: e.UpdatedAt.Format(time.RFC3339),
// 	}
// }

// func hash(pw string) (string, error) {
// 	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
// 	return string(b), err
// }

// // ---------- handlers ----------

// // GET /api/employees?q=&role=&page=&page_size=
// func ListEmployees(c *gin.Context) {
// 	q := strings.TrimSpace(c.Query("q"))
// 	role := strings.TrimSpace(c.Query("role")) // ชื่อ role ตรง ๆ
// 	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
// 	if page < 1 {
// 		page = 1
// 	}
// 	ps, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
// 	if ps < 1 {
// 		ps = 10
// 	}

// 	tx := configs.DB.Model(&entity.Employee{})
// 	if q != "" {
// 		like := "%" + q + "%"
// 		tx = tx.Where("first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR role LIKE ?", like, like, like, like)
// 	}
// 	if role != "" && role != "all" {
// 		tx = tx.Where("role = ?", role)
// 	}

// 	var total int64
// 	if err := tx.Count(&total).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	var rows []entity.Employee
// 	if err := tx.Order("created_at DESC").
// 		Offset((page-1)*ps).
// 		Limit(ps).
// 		Find(&rows).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	items := make([]EmployeeResp, 0, len(rows))
// 	for _, e := range rows {
// 		items = append(items, empToResp(e))
// 	}

// 	c.JSON(http.StatusOK, EmployeePage{Items: items, Total: total, Page: page, PageSize: ps})
// }

// // GET /api/employees/:id
// func GetEmployee(c *gin.Context) {
// 	id := c.Param("id")
// 	var e entity.Employee
// 	if err := configs.DB.First(&e, "id = ?", id).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, empToResp(e))
// }

// // POST /api/employees
// func CreateEmployee(c *gin.Context) {
// 	var req EmployeeCreateReq
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid: " + err.Error()})
// 		return
// 	}
// 	pw, err := hash(req.Password)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot hash password"})
// 		return
// 	}
// 	e := entity.Employee{
// 		FirstName:    req.FirstName,
// 		LastName:     req.LastName,
// 		Username:     req.Username,
// 		PasswordHash: pw,
// 		Role:         req.Role,
// 	}
// 	if err := configs.DB.Create(&e).Error; err != nil {
// 		msg := err.Error()
// 		if strings.Contains(strings.ToLower(msg), "unique") || strings.Contains(strings.ToLower(msg), "duplicate") {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลซ้ำ (username): " + msg})
// 			return
// 		}
// 		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
// 		return
// 	}
// 	c.JSON(http.StatusCreated, gin.H{"id": e.ID})
// }

// // PUT /api/employees/:id
// func UpdateEmployee(c *gin.Context) {
// 	id := c.Param("id")
// 	var req EmployeeUpdateReq
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid: " + err.Error()})
// 		return
// 	}
// 	updates := map[string]interface{}{}
// 	if req.FirstName != nil {
// 		updates["first_name"] = *req.FirstName
// 	}
// 	if req.LastName != nil {
// 		updates["last_name"] = *req.LastName
// 	}
// 	if req.Username != nil {
// 		updates["username"] = *req.Username
// 	}
// 	if req.Role != nil {
// 		updates["role"] = *req.Role
// 	}
// 	if req.Password != nil && *req.Password != "" {
// 		pw, err := hash(*req.Password)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot hash password"})
// 			return
// 		}
// 		updates["password_hash"] = pw
// 	}
// 	if len(updates) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "no updates"})
// 		return
// 	}
// 	if err := configs.DB.Model(&entity.Employee{}).Where("id = ?", id).Updates(updates).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"success": true})
// }

// // DELETE /api/employees/:id
// func DeleteEmployee(c *gin.Context) {
// 	id := c.Param("id")
// 	if err := configs.DB.Delete(&entity.Employee{}, id).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.Status(http.StatusNoContent)
// }
