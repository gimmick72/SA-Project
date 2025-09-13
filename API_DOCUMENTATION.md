# Dental Clinic Management System - Backend API Documentation

## Overview
This document provides comprehensive documentation for the backend API endpoints of the Dental Clinic Management System. The backend is built with Go, Gin framework, and GORM ORM with SQLite database.

## Base URL
```
http://localhost:8080/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "data": <response_data>,
  "message": "Success message",
  "pagination": {  // Only for list endpoints
    "page": 1,
    "page_size": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

## Error Response Format
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user (patient or admin).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin", // "patient" or "admin"
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "0123456789", // Optional
  "date_of_birth": "1990-01-01", // Optional, for patients
  "citizen_id": "1234567890123", // Optional, for patients
  "department": "IT", // Optional, for admins
  "position": "Manager" // Optional, for admins
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2025-09-12T08:34:01.271744+07:00"
  },
  "message": "User registered successfully"
}
```

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "admin",
      "first_name": "John",
      "last_name": "Doe",
      "last_login": "2025-09-12T08:34:11.358305+07:00"
    }
  },
  "message": "Login successful"
}
```

### 3. User Logout
**POST** `/auth/logout`

Logout user (token invalidation handled client-side).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### 4. Get User Profile
**GET** `/profile`

Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin",
    "first_name": "John",
    "last_name": "Doe",
    "department": "IT",
    "position": "Manager"
  }
}
```

### 5. Update User Profile
**PUT** `/profile`

Update current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "0987654321"
}
```

### 6. Change Password
**PUT** `/profile/password`

Change current user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

---

## Payment System Endpoints

### 1. Create Payment
**POST** `/payments`

Create a new payment record.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 1500.00,
  "payment_method": "cash", // "cash", "credit_card", "promptpay", "bank_transfer"
  "patient_id": 1,
  "staff_id": 1,
  "service_id": 1,
  "description": "Dental cleaning payment"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "transaction_number": "TXN202509121864651CE05C7B58",
    "amount": 1500,
    "payment_method": "cash",
    "status": "completed",
    "payment_date": "2025-09-12T08:35:29.278981+07:00",
    "description": "Dental cleaning payment",
    "service_name": "ขูดหินปูน",
    "staff_name": "Somsak Thongdee",
    "receipt_number": "RCP202509127362A0",
    "created_at": "2025-09-12T08:35:29.279037+07:00"
  },
  "message": "Payment created successfully"
}
```

### 2. Get Payments
**GET** `/payments`

Get list of payments with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `payment_method` (optional): Filter by payment method
- `patient_id` (optional): Filter by patient ID

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "transaction_number": "TXN202509121864651CE05C7B58",
      "amount": 1500,
      "payment_method": "cash",
      "status": "completed",
      "service_name": "ขูดหินปูน",
      "staff_name": "Somsak Thongdee",
      "receipt_number": "RCP202509127362A0"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

### 3. Get Payment by ID
**GET** `/payments/:id`

Get specific payment details.

**Headers:** `Authorization: Bearer <token>`

### 4. Update Payment
**PUT** `/payments/:id`

Update payment information.

**Headers:** `Authorization: Bearer <token>`

### 5. Delete Payment
**DELETE** `/payments/:id`

Delete a payment record.

**Headers:** `Authorization: Bearer <token>`

---

## Receipt System Endpoints

### 1. Create Receipt
**POST** `/receipts`

Create a receipt for an existing payment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "payment_id": 1,
  "customer_name": "John Doe",
  "customer_phone": "0123456789",
  "customer_address": "123 Main St, Bangkok",
  "tax_amount": 105.00,
  "notes": "Thank you for your visit"
}
```

### 2. Get Receipts
**GET** `/receipts`

Get list of receipts with pagination.

**Headers:** `Authorization: Bearer <token>`

### 3. Get Receipt by ID
**GET** `/receipts/:id`

Get specific receipt details.

**Headers:** `Authorization: Bearer <token>`

### 4. Cancel Receipt
**PUT** `/receipts/:id/cancel`

Cancel a receipt.

**Headers:** `Authorization: Bearer <token>`

---

## Attendance System Endpoints

### 1. Staff Check-in
**POST** `/attendance/checkin`

Record staff check-in time.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "staff_id": 1,
  "location": "Main Clinic",
  "notes": "Regular check-in"
}
```

**Response:**
```json
{
  "data": {
    "check_in_time": "2025-09-12T08:36:32.595848+07:00",
    "is_late": true,
    "late_minutes": 36
  },
  "message": "Checked in successfully"
}
```

### 2. Staff Check-out
**POST** `/attendance/checkout`

Record staff check-out time.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "staff_id": 1,
  "notes": "End of shift"
}
```

### 3. Create Attendance Record
**POST** `/attendance`

Create a new attendance record.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "staff_id": 1,
  "date": "2025-09-12",
  "status": "present",
  "notes": "Regular attendance",
  "location": "Main Clinic"
}
```

### 4. Get Attendance Records
**GET** `/attendance`

Get list of attendance records with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number
- `page_size` (optional): Items per page
- `staff_id` (optional): Filter by staff ID
- `date` (optional): Filter by date
- `status` (optional): Filter by status

### 5. Get Attendance Statistics
**GET** `/attendance/stats`

Get attendance statistics for a date range.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `from_date` (optional): Start date (default: 30 days ago)
- `to_date` (optional): End date (default: today)

**Response:**
```json
{
  "data": {
    "total_staff": 10,
    "present_count": 8,
    "late_count": 2,
    "absent_count": 0,
    "half_day_count": 0,
    "average_hours": 8.5,
    "total_hours": 68.0
  },
  "date_range": {
    "from": "2025-08-13",
    "to": "2025-09-12"
  }
}
```

### 6. Get Attendance by ID
**GET** `/attendance/:id`

Get specific attendance record.

**Headers:** `Authorization: Bearer <token>`

### 7. Update Attendance
**PUT** `/attendance/:id`

Update attendance record.

**Headers:** `Authorization: Bearer <token>`

### 8. Delete Attendance
**DELETE** `/attendance/:id`

Delete attendance record.

**Headers:** `Authorization: Bearer <token>`

---

## Admin-Only Endpoints

### 1. Get All Patients
**GET** `/admin/patients`

Get list of all patient users.

**Headers:** `Authorization: Bearer <admin_token>`

### 2. Get All Admins
**GET** `/admin/admins`

Get list of all admin users.

**Headers:** `Authorization: Bearer <admin_token>`

---

## Database Entities

### User Entity
```go
type User struct {
    ID          uint      `json:"id"`
    Email       string    `json:"email"`
    Password    string    `json:"-"` // Hidden from responses
    Role        string    `json:"role"` // "patient" or "admin"
    FirstName   string    `json:"first_name"`
    LastName    string    `json:"last_name"`
    PhoneNumber string    `json:"phone_number"`
    DateOfBirth string    `json:"date_of_birth"`
    IsActive    bool      `json:"is_active"`
    LastLogin   *time.Time `json:"last_login"`
    CitizenID   string    `json:"citizen_id"` // For patients
    Department  string    `json:"department"` // For admins
    Position    string    `json:"position"`   // For admins
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
```

### Payment Entity
```go
type Payment struct {
    ID                uint      `json:"id"`
    TransactionNumber string    `json:"transaction_number"`
    Amount           float64   `json:"amount"`
    PaymentMethod    string    `json:"payment_method"`
    Status           string    `json:"status"`
    PaymentDate      time.Time `json:"payment_date"`
    Description      string    `json:"description"`
    PatientID        uint      `json:"patient_id"`
    StaffID          uint      `json:"staff_id"`
    ServiceID        uint      `json:"service_id"`
    CreatedAt        time.Time `json:"created_at"`
    UpdatedAt        time.Time `json:"updated_at"`
}
```

### Attendance Entity
```go
type Attendance struct {
    ID           uint       `json:"id"`
    StaffID      uint       `json:"staff_id"`
    Date         time.Time  `json:"date"`
    CheckInTime  *time.Time `json:"check_in_time"`
    CheckOutTime *time.Time `json:"check_out_time"`
    WorkHours    float64    `json:"work_hours"`
    Status       string     `json:"status"`
    Notes        string     `json:"notes"`
    Location     string     `json:"location"`
    IsLate       bool       `json:"is_late"`
    LateMinutes  int        `json:"late_minutes"`
    CreatedAt    time.Time  `json:"created_at"`
    UpdatedAt    time.Time  `json:"updated_at"`
}
```

---

## Status Codes

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Frontend Integration

### Authentication Flow
1. User registers/logs in via `/auth/register` or `/auth/login`
2. Store JWT token in localStorage or sessionStorage
3. Include token in Authorization header for protected routes
4. Handle token expiration and redirect to login

### Example JavaScript Integration
```javascript
// Login
const login = async (email, password, role) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });
  
  const data = await response.json();
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// Authenticated API call
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};
```

---

## Server Configuration

### Environment Variables
Create a `.env` file in the Database directory:
```env
PORT=8080
JWT_SECRET=SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx
JWT_ISSUER=AuthService
DB_PATH=./clinic.db
```

### Running the Server
```bash
cd Database
go mod tidy
go build -o main .
./main
```

The server will start on `http://localhost:8080` with all API endpoints available.

---

## Testing

### Sample Test Commands
```bash
# Register admin user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123","role":"admin","first_name":"Admin","last_name":"User","department":"Management","position":"Administrator"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123","role":"admin"}'

# Create payment (replace TOKEN with actual JWT token)
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount":1500.00,"payment_method":"cash","patient_id":1,"staff_id":1,"service_id":1,"description":"Dental cleaning"}'

# Check-in staff
curl -X POST http://localhost:8080/api/attendance/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"staff_id":1,"location":"Main Clinic","notes":"Regular check-in"}'
```

This completes the comprehensive API documentation for the Dental Clinic Management System backend.
