package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User represents system users (patients and admins)
type User struct {
	gorm.Model
	Email       string    `json:"email" gorm:"uniqueIndex;not null"`
	Password    string    `json:"-" gorm:"not null"` // Hidden from JSON responses
	Role        string    `json:"role" gorm:"not null;check:role IN ('patient','admin')"`
	FirstName   string    `json:"first_name" gorm:"not null"`
	LastName    string    `json:"last_name" gorm:"not null"`
	PhoneNumber string    `json:"phone_number"`
	DateOfBirth string    `json:"date_of_birth"` // Store as string to avoid parsing issues
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	LastLogin   *time.Time `json:"last_login"`
	
	// Patient-specific fields (only for role=patient)
	CitizenID string `json:"citizen_id" gorm:"uniqueIndex"`
	
	// Admin-specific fields (only for role=admin)
	Department string `json:"department"`
	Position   string `json:"position"`
	
	// Relations - removed to avoid foreign key validation issues
	// PatientProfile *Patient      `json:"patient_profile,omitempty" gorm:"foreignKey:Email;references:Email"`
	// StaffProfile   *PersonalData `json:"staff_profile,omitempty" gorm:"foreignKey:Email;references:Email"`
}

// RegisterRequest for user registration
type RegisterRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=6"`
	Role        string `json:"role" binding:"required,oneof=patient admin"`
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	PhoneNumber string `json:"phone_number"`
	DateOfBirth string `json:"date_of_birth"`
	
	// Patient-specific
	CitizenID string `json:"citizen_id"`
	
	// Admin-specific
	Department string `json:"department"`
	Position   string `json:"position"`
}

// LoginRequest for user authentication
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=patient admin"`
}

// UserResponse for API responses (excludes sensitive data)
type UserResponse struct {
	ID          uint       `json:"id"`
	Email       string     `json:"email"`
	Role        string     `json:"role"`
	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	PhoneNumber string     `json:"phone_number"`
	DateOfBirth string     `json:"date_of_birth"`
	IsActive    bool       `json:"is_active"`
	LastLogin   *time.Time `json:"last_login"`
	CitizenID   string     `json:"citizen_id,omitempty"`
	Department  string     `json:"department,omitempty"`
	Position    string     `json:"position,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

// LoginResponse for successful authentication
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// UpdateProfileRequest for updating user profile
type UpdateProfileRequest struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	PhoneNumber string `json:"phone_number"`
	DateOfBirth string `json:"date_of_birth"`
	Department  string `json:"department"`
	Position    string `json:"position"`
}

// ChangePasswordRequest for password changes
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

// Hash password before saving
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// Check if provided password matches the hashed password
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// Check if user is a patient
func (u *User) IsPatient() bool {
	return u.Role == "patient"
}

// Check if user is an admin
func (u *User) IsAdmin() bool {
	return u.Role == "admin"
}

// Get full name
func (u *User) GetFullName() string {
	return u.FirstName + " " + u.LastName
}

// Update last login time
func (u *User) UpdateLastLogin() {
	now := time.Now()
	u.LastLogin = &now
}
