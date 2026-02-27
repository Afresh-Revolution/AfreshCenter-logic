# AfreshCenter API Request Bodies

This document provides detailed JSON examples for all API endpoints that require a request body.

---

## 1. Admin Authentication
### POST `/api/admin/login`
**Description**: Authenticates an admin user.

```json
{
  "email": "admin@example.com",
  "password": "your_secure_password",
  "rememberMe": true
}
```

---

## 2. Admin Service Management
### POST `/api/admin/services`
**Description**: Creates a new service.

```json
{
  "title": "Professional Consultation",
  "category": "Advisory",
  "priceRange": "$100 - $500",
  "visible": true
}
```

### PATCH `/api/admin/services/:id`
**Description**: Updates an existing service (all fields optional).

```json
{
  "title": "Advanced Professional Consultation",
  "priceRange": "$200 - $600"
}
```

### PATCH `/api/admin/services/:id/visibility`
**Description**: Explicitly sets service visibility.

```json
{
  "visible": false
}
```

---

## 3. Contact Us
### POST `/api/contact`
**Description**: Submits a message from the contact form.

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry about Services",
  "message": "I would like to know more about your center's offerings."
}
```

### PATCH `/api/contact/template`
**Description**: Updates the email notification template for contacts.
**Placeholders**: `{{name}}`, `{{email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`

```json
{
  "subject": "New Contact Message: {{subject}}",
  "body": "Hello,\n\nYou have a new message from {{name}}.\n\nEmail: {{email}}\nMessage:\n{{message}}"
}
```

---

## 4. Teams Management
### POST `/api/teams`
**Description**: Adds a new team member.

```json
{
  "name": "Blessing Adukuchilli",
  "role": "Administrative Manager",
  "bio": "Manages internal documentation, compliance, and processes.",
  "image_url": "https://example.com/images/blessing.jpg"
}
```

### PATCH `/api/teams/:id`
**Description**: Updates a team member's information.

```json
{
  "role": "Senior Administrative Manager",
  "bio": "Lead coordinator for internal documentation and compliance."
}
```

---

## 5. Booking Sessions
### POST `/api/bookings`
**Description**: Submits a new session booking.

```json
{
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone_number": "+0987654321",
  "company": "Tech Solutions Inc.",
  "project_details": "We need a consultation on our upcoming infrastructure project."
}
```

### PATCH `/api/bookings/template`
**Description**: Updates the email notification template for bookings.
**Placeholders**: `{{full_name}}`, `{{email}}`, `{{phone_number}}`, `{{company}}`, `{{project_details}}`

```json
{
  "subject": "New Booking from {{full_name}}",
  "body": "A new session has been booked.\n\nClient: {{full_name}}\nCompany: {{company}}\n\nDetails:\n{{project_details}}"
}
```
