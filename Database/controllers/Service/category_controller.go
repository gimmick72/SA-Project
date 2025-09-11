// controllers/category_controller.go
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)


type Category struct{
	ID      	uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	NameCategory string  `json:"name_category"`
}


// ดึง Category ทั้งหมด
func ListCategories(c *gin.Context) {
	var categories []entity.Category
	db := configs.DB
	
	if err := db.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// สร้าง Category ใหม่
func CreateCategory(c *gin.Context) {
	var category entity.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validation
	if category.NameCategory == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category name is required"})
		return
	}

	db := configs.DB
	if err := db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}


// อัปเดต Category
func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var category entity.Category
	db := configs.DB

	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	var input entity.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.NameCategory != "" {
		category.NameCategory = input.NameCategory
	}

	if err := db.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// ลบ Category
func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	db := configs.DB

	var category entity.Category
	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// ตรวจสอบว่ามี service ใช้ category นี้อยู่มั้ย
	var serviceCount int64
	db.Model(&entity.Service{}).Where("category_id = ?", id).Count(&serviceCount)
	if serviceCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete category that has services"})
		return
	}

	if err := db.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}