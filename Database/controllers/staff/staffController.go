// Database/controllers/staffController.go
package controllers

import (
	"Database/configs"
	"Database/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /staff
func GetAllStaff(c *gin.Context) {
	var departments []entity.Department
	if err := configs.DB.
		Preload("PersonalData").
		Where("personal_data_id IS NOT NULL").
		Find(&departments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, departments)
}

// GET /staff/:id
func GetStaffByID(c *gin.Context) {
	id := c.Param("id")
	var person entity.PersonalData
	if err := configs.DB.Preload("Department").First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, person)
}

// PUT /staff/:id
func UpdateStaff(c *gin.Context) {
	
	id := c.Param("id")

	// Bind JSON ข้อมูล personal + department (nested)
	var input struct {
		PersonalData entity.PersonalData `json:"personalData"`
		Department   entity.Department   `json:"department"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// หา record เดิมก่อน
	var person entity.PersonalData
	if err := configs.DB.Preload("Department").First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	// Update personal data
	if err := configs.DB.Model(&person).Updates(input.PersonalData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update department
	if person.Department.ID != 0 {
		if err := configs.DB.Model(&person.Department).Updates(input.Department).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	// reload ข้อมูลล่าสุด
	if err := configs.DB.Preload("Department").First(&person, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, person)
}
// POST /staff
func AddStaff(c *gin.Context) {
  var input struct {
    PersonalData entity.PersonalData `json:"personalData"`
    Department   entity.Department   `json:"department"`
  }
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  // บันทึก PersonalData ก่อน
  if err := configs.DB.Create(&input.PersonalData).Error; err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }

  // ผูก Department กับ PersonalData
  input.Department.PersonalDataID = input.PersonalData.ID
  if err := configs.DB.Create(&input.Department).Error; err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }

  // โหลดข้อมูลล่าสุดพร้อม Department
  var person entity.PersonalData
  configs.DB.Preload("Department").First(&person, input.PersonalData.ID)

  c.JSON(http.StatusOK, person)
}

// DELETE /staff/:id
func DeleteStaff(c *gin.Context) {
    id := c.Param("id")

    // หา record ก่อน
    var person entity.PersonalData
    if err := configs.DB.Preload("Department").First(&person, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }

    // ลบ Department ก่อน (กัน foreign key constraint)
    if person.Department.ID != 0 {
        if err := configs.DB.Delete(&person.Department).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }

    // ลบ PersonalData
    if err := configs.DB.Delete(&person).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}


