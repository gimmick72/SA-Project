package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"Database/configs"
	"Database/entity"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// ---------- DTO ----------
type MemberResp struct {
	ID        uint   `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at,omitempty"`
	UpdatedAt string `json:"updated_at,omitempty"`
}

type MemberPage struct {
	Items    []MemberResp `json:"items"`
	Total    int64        `json:"total"`
	Page     int          `json:"page"`
	PageSize int          `json:"page_size"`
}

type MemberCreateReq struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name"  binding:"required"`
	Email     string `json:"email"      binding:"required,email"`
	Phone     string `json:"phone"      binding:"required"`
	Username  string `json:"username"   binding:"required"`
	Password  string `json:"password"   binding:"required,min=6"`
}
type MemberUpdateReq struct {
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
	Email     *string `json:"email"`
	Phone     *string `json:"phone"`
	Username  *string `json:"username"`
	Password  *string `json:"password"`
}

// ---------- helpers ----------
func toResp(m entity.Member) MemberResp {
	return MemberResp{
		ID:        m.ID,
		FirstName: m.MemberFirstName,
		LastName:  m.MemberLastName,
		Email:     m.Email,
		Phone:     m.PhoneNumber,
		Username:  m.Username,
		CreatedAt: m.CreatedAt.Format(time.RFC3339),
		UpdatedAt: m.UpdatedAt.Format(time.RFC3339),
	}
}
func hashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

// ---------- handlers ----------
func ListMembers(c *gin.Context) {
	q := strings.TrimSpace(c.Query("q"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 { page = 1 }
	ps, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if ps < 1 { ps = 10 }

	tx := configs.DB.Model(&entity.Member{})
	if q != "" {
		like := "%" + q + "%"
		tx = tx.Where(`
			member_first_name LIKE ? OR member_last_name LIKE ? OR
			email LIKE ? OR phone_number LIKE ? OR username LIKE ?`,
			like, like, like, like, like)
	}

	var total int64
	if err := tx.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
	}

	var rows []entity.Member
	if err := tx.Order("created_at DESC").
		Offset((page-1)*ps).Limit(ps).Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
	}

	items := make([]MemberResp, 0, len(rows))
	for _, m := range rows { items = append(items, toResp(m)) }

	c.JSON(http.StatusOK, MemberPage{ Items: items, Total: total, Page: page, PageSize: ps })
}

func GetMember(c *gin.Context) {
	id := c.Param("id")
	var m entity.Member
	if err := configs.DB.First(&m, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"}); return
	}
	c.JSON(http.StatusOK, toResp(m))
}

func CreateMember(c *gin.Context) {
	var req MemberCreateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return
	}
	pw, err := hashPassword(req.Password)
	if err != nil { c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot hash password"}); return }

	m := entity.Member{
		MemberFirstName: req.FirstName,
		MemberLastName:  req.LastName,
		PhoneNumber:     req.Phone,
		Email:           req.Email,
		Username:        req.Username,
		PasswordHash:    pw,
	}
	if err := configs.DB.Create(&m).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return
	}
	c.JSON(http.StatusCreated, gin.H{"id": m.ID})
}

func UpdateMember(c *gin.Context) {
	id := c.Param("id")
	var req MemberUpdateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return
	}

	updates := map[string]interface{}{}
	if req.FirstName != nil { updates["member_first_name"] = *req.FirstName }
	if req.LastName  != nil { updates["member_last_name"]  = *req.LastName  }
	if req.Email     != nil { updates["email"]             = *req.Email     }
	if req.Phone     != nil { updates["phone_number"]      = *req.Phone     }
	if req.Username  != nil { updates["username"]          = *req.Username  }
	if req.Password  != nil && *req.Password != "" {
		pw, err := hashPassword(*req.Password)
		if err != nil { c.JSON(500, gin.H{"error": "cannot hash password"}); return }
		updates["password_hash"] = pw
	}
	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no updates"}); return
	}
	if err := configs.DB.Model(&entity.Member{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

func DeleteMember(c *gin.Context) {
	id := c.Param("id")
	if err := configs.DB.Delete(&entity.Member{}, id).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return
	}
	c.Status(http.StatusNoContent)
}
