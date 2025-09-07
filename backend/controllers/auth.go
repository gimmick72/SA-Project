package controllers

import (
	"net/http"
	"time"

	"Database/configs"
	"Database/entity"
	services "Database/service"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct{}

// Register creates a new user account with role validation
func (ac *AuthController) Register(c *gin.Context) {
	var req entity.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	db := configs.DB()

	// Check if user already exists
	var existingUser entity.User
	if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"error":   "User with this email already exists",
		})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to hash password",
		})
		return
	}

	// Create user with role-specific fields
	user := entity.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      req.Role,
		IsActive:  true,
	}

	// Set role-specific fields
	if req.Role == "patient" {
		user.PhoneNumber = req.PhoneNumber
		user.DateOfBirth = req.DateOfBirth // Store as string directly
	} else if req.Role == "admin" {
		user.Department = req.Department
		user.Position = req.Position
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create user",
		})
		return
	}

	// Generate JWT token with role
	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	token, err := jwtWrapper.GenerateToken(user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to generate token",
		})
		return
	}

	// Update last login
	now := time.Now()
	user.LastLogin = &now
	db.Save(&user)

	// Return response
	userResponse := ac.toUserResponse(&user)

	c.JSON(http.StatusCreated, entity.LoginResponse{
		Success: true,
		Message: "User registered successfully",
		Token:   token,
		User:    userResponse,
	})
}

// Login authenticates a user with role validation
func (ac *AuthController) Login(c *gin.Context) {
	var req entity.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	db := configs.DB()

	// Find user by email and role
	var user entity.User
	if err := db.Where("email = ? AND role = ?", req.Email, req.Role).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid email, password, or role",
		})
		return
	}

	// Check if user is active
	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Account is deactivated",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Invalid email, password, or role",
		})
		return
	}

	// Generate JWT token
	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	token, err := jwtWrapper.GenerateToken(user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to generate token",
		})
		return
	}

	// Update last login
	now := time.Now()
	user.LastLogin = &now
	db.Save(&user)

	// Return response
	userResponse := ac.toUserResponse(&user)

	c.JSON(http.StatusOK, entity.LoginResponse{
		Success: true,
		Message: "Login successful",
		Token:   token,
		User:    userResponse,
	})
}

// GetProfile returns current user profile
func (ac *AuthController) GetProfile(c *gin.Context) {
	// Get email from JWT token (set by middleware)
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	db := configs.DB()

	var user entity.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "User not found",
		})
		return
	}

	userResponse := ac.toUserResponse(&user)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user":    userResponse,
	})
}

// GetPatients returns all users with patient role (admin only)
func (ac *AuthController) GetPatients(c *gin.Context) {
	db := configs.DB()

	var patients []entity.User
	if err := db.Where("role = ?", "patient").Find(&patients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch patients",
		})
		return
	}

	var patientResponses []entity.UserResponse
	for _, patient := range patients {
		patientResponses = append(patientResponses, ac.toUserResponse(&patient))
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"patients": patientResponses,
		"total":    len(patientResponses),
	})
}

// GetAdmins returns all users with admin role (admin only)
func (ac *AuthController) GetAdmins(c *gin.Context) {
	db := configs.DB()

	var admins []entity.User
	if err := db.Where("role = ?", "admin").Find(&admins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch admins",
		})
		return
	}

	var adminResponses []entity.UserResponse
	for _, admin := range admins {
		adminResponses = append(adminResponses, ac.toUserResponse(&admin))
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"admins":  adminResponses,
		"total":   len(adminResponses),
	})
}

// UpdateProfile updates user profile
func (ac *AuthController) UpdateProfile(c *gin.Context) {
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	var req entity.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	db := configs.DB()

	var user entity.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "User not found",
		})
		return
	}

	// Update fields
	user.FirstName = req.FirstName
	user.LastName = req.LastName

	// Update role-specific fields
	if user.Role == "patient" {
		user.PhoneNumber = req.PhoneNumber
		user.DateOfBirth = req.DateOfBirth
	} else if user.Role == "admin" {
		user.Department = req.Department
		user.Position = req.Position
	}

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update profile",
		})
		return
	}

	userResponse := ac.toUserResponse(&user)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"user":    userResponse,
	})
}

// Logout (client-side token removal)
func (ac *AuthController) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

// Helper function to convert User to UserResponse
func (ac *AuthController) toUserResponse(user *entity.User) entity.UserResponse {
	return entity.UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Role:        user.Role,
		IsActive:    user.IsActive,
		LastLogin:   user.LastLogin,
		PhoneNumber: user.PhoneNumber,
		DateOfBirth: user.DateOfBirth,
		Department:  user.Department,
		Position:    user.Position,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}
}
