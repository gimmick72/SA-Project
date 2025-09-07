package entity

import (
	"time"
	"gorm.io/gorm"
)

// User represents a system user with role-based access
type User struct {
	gorm.Model
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"not null"` // Hidden in JSON responses
	FirstName string    `json:"first_name" gorm:"not null"`
	LastName  string    `json:"last_name" gorm:"not null"`
	Role      string    `json:"role" gorm:"not null;check:role IN ('patient','admin')"` // patient or admin
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	LastLogin *time.Time `json:"last_login,omitempty"`
	
	// Patient-specific fields (only used when role = 'patient')
	PhoneNumber string `json:"phone_number,omitempty"`
	DateOfBirth string `json:"date_of_birth,omitempty"` // Store as string in YYYY-MM-DD format
	
	// Admin-specific fields (only used when role = 'admin')
	Department  string `json:"department,omitempty"`
	Position    string `json:"position,omitempty"`
}

// LoginRequest represents login request payload
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=patient admin"`
}

// RegisterRequest represents registration request payload
type RegisterRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=6"`
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	Role        string `json:"role" binding:"required,oneof=patient admin"`
	PhoneNumber string `json:"phone_number,omitempty"`
	DateOfBirth string `json:"date_of_birth,omitempty"` // Accept as string for easier parsing
	Department  string `json:"department,omitempty"`
	Position    string `json:"position,omitempty"`
}

// LoginResponse represents login response
type LoginResponse struct {
	Success bool         `json:"success"`
	Message string       `json:"message"`
	Token   string       `json:"token"`
	User    UserResponse `json:"user"`
}

// UserResponse represents user data in API responses (excludes password)
type UserResponse struct {
	ID          uint       `json:"id"`
	Email       string     `json:"email"`
	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	Role        string     `json:"role"`
	IsActive    bool       `json:"is_active"`
	LastLogin   *time.Time `json:"last_login,omitempty"`
	PhoneNumber string     `json:"phone_number,omitempty"`
	DateOfBirth string     `json:"date_of_birth,omitempty"` // Changed to string to match User entity
	Department  string     `json:"department,omitempty"`
	Position    string     `json:"position,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// RoleCheckRequest for role-based access validation
type RoleCheckRequest struct {
	RequiredRole string `json:"required_role"`
}

// GetFullName returns the user's full name
func (u *User) GetFullName() string {
	return u.FirstName + " " + u.LastName
}

// IsPatient checks if user has patient role
func (u *User) IsPatient() bool {
	return u.Role == "patient"
}

// IsAdmin checks if user has admin role
func (u *User) IsAdmin() bool {
	return u.Role == "admin"
}
