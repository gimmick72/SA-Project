package controllers

import (
	"net/http"

	"Database/configs"
	"Database/entity"
	services "Database/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Register creates a new user account
func Register(c *gin.Context) {
	var req entity.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser entity.User
	if err := configs.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Create new user
	user := entity.User{
		Email:       req.Email,
		Password:    req.Password,
		Role:        req.Role,
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		PhoneNumber: req.PhoneNumber,
		DateOfBirth: req.DateOfBirth,
		CitizenID:   req.CitizenID,
		Department:  req.Department,
		Position:    req.Position,
		IsActive:    true,
	}

	// Hash password
	if err := user.HashPassword(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password", "details": err.Error()})
		return
	}

	// Save user
	if err := configs.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user", "details": err.Error()})
		return
	}

	// Create response
	response := entity.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Role:        user.Role,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		PhoneNumber: user.PhoneNumber,
		DateOfBirth: user.DateOfBirth,
		IsActive:    user.IsActive,
		CitizenID:   user.CitizenID,
		Department:  user.Department,
		Position:    user.Position,
		CreatedAt:   user.CreatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"data":    response,
	})
}

// Login authenticates a user and returns JWT token
func Login(c *gin.Context) {
	var req entity.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Find user by email and role
	var user entity.User
	if err := configs.DB.Where("email = ? AND role = ?", req.Email, req.Role).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user", "details": err.Error()})
		return
	}

	// Check if user is active
	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account is deactivated"})
		return
	}

	// Verify password
	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Update last login
	user.UpdateLastLogin()
	configs.DB.Save(&user)

	// Generate JWT token
	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	token, err := jwtWrapper.GenerateToken(user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token", "details": err.Error()})
		return
	}

	// Create response
	userResponse := entity.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Role:        user.Role,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		PhoneNumber: user.PhoneNumber,
		DateOfBirth: user.DateOfBirth,
		IsActive:    user.IsActive,
		LastLogin:   user.LastLogin,
		CitizenID:   user.CitizenID,
		Department:  user.Department,
		Position:    user.Position,
		CreatedAt:   user.CreatedAt,
	}

	response := entity.LoginResponse{
		Token: token,
		User:  userResponse,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"data":    response,
	})
}

// Logout handles user logout (client-side token removal)
func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

// GetProfile retrieves current user profile
func GetProfile(c *gin.Context) {
	// Get email from JWT token (set by middleware)
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user entity.User
	if err := configs.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user", "details": err.Error()})
		return
	}

	response := entity.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Role:        user.Role,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		PhoneNumber: user.PhoneNumber,
		DateOfBirth: user.DateOfBirth,
		IsActive:    user.IsActive,
		LastLogin:   user.LastLogin,
		CitizenID:   user.CitizenID,
		Department:  user.Department,
		Position:    user.Position,
		CreatedAt:   user.CreatedAt,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// UpdateProfile updates user profile information
func UpdateProfile(c *gin.Context) {
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user entity.User
	if err := configs.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user", "details": err.Error()})
		return
	}

	var req entity.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Update fields
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.PhoneNumber != "" {
		user.PhoneNumber = req.PhoneNumber
	}
	if req.DateOfBirth != "" {
		user.DateOfBirth = req.DateOfBirth
	}
	if req.Department != "" && user.IsAdmin() {
		user.Department = req.Department
	}
	if req.Position != "" && user.IsAdmin() {
		user.Position = req.Position
	}

	if err := configs.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

// ChangePassword changes user password
func ChangePassword(c *gin.Context) {
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user entity.User
	if err := configs.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user", "details": err.Error()})
		return
	}

	var req entity.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Verify current password
	if !user.CheckPassword(req.CurrentPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	// Update password
	user.Password = req.NewPassword
	if err := user.HashPassword(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password", "details": err.Error()})
		return
	}

	if err := configs.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

// GetPatients retrieves all patients (admin only)
func GetPatients(c *gin.Context) {
	var users []entity.User
	if err := configs.DB.Where("role = ?", "patient").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve patients", "details": err.Error()})
		return
	}

	var responses []entity.UserResponse
	for _, user := range users {
		response := entity.UserResponse{
			ID:          user.ID,
			Email:       user.Email,
			Role:        user.Role,
			FirstName:   user.FirstName,
			LastName:    user.LastName,
			PhoneNumber: user.PhoneNumber,
			DateOfBirth: user.DateOfBirth,
			IsActive:    user.IsActive,
			LastLogin:   user.LastLogin,
			CitizenID:   user.CitizenID,
			CreatedAt:   user.CreatedAt,
		}
		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{"data": responses})
}

// GetAdmins retrieves all admins (admin only)
func GetAdmins(c *gin.Context) {
	var users []entity.User
	if err := configs.DB.Where("role = ?", "admin").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve admins", "details": err.Error()})
		return
	}

	var responses []entity.UserResponse
	for _, user := range users {
		response := entity.UserResponse{
			ID:         user.ID,
			Email:      user.Email,
			Role:       user.Role,
			FirstName:  user.FirstName,
			LastName:   user.LastName,
			IsActive:   user.IsActive,
			LastLogin:  user.LastLogin,
			Department: user.Department,
			Position:   user.Position,
			CreatedAt:  user.CreatedAt,
		}
		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{"data": responses})
}
