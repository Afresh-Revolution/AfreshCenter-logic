# AfreshCenter Email System Documentation

This document explains how the email system is structured and how to trigger or customize notifications.

## 1. Core Technology
The system uses **[Resend](https://resend.com)** for reliable email delivery.

- **Service**: `src/services/email.service.js`
- **Dependency**: `resend` (installed via npm)

## 2. Configuration
To use the email system, the following variables must be set in your `.env` file:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev  # Or your verified domain
NOTIFICATION_EMAIL=your_admin_email@example.com
```

> [!IMPORTANT]
> When using `onboarding@resend.dev`, you can **only** send emails to the email address you signed up with on Resend. To send to anyone else, you must verify a domain in the Resend dashboard.

## 3. How to Trigger Emails
Emails are automatically triggered by the following API actions:

### A. Contact Form Submission
- **Endpoint**: `POST /api/contact`
- **Function**: Saves message to DB and triggers notification.
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  }
  ```

### B. Booking Session Submission
- **Endpoint**: `POST /api/bookings`
- **Function**: Saves booking to DB and triggers notification.
- **Payload**:
  ```json
  {
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "phone_number": "1234567890",
    "project_details": "Consultation request"
  }
  ```

## 4. Customizing Email Templates
The system uses dynamic templates stored in the database. You can edit them via the API without changing code.

### Endpoints:
- **Contact Template**: `GET /api/contact/template` | `PATCH /api/contact/template`
- **Booking Template**: `GET /api/bookings/template` | `PATCH /api/bookings/template`

### Using Placeholders:
You can use double curly braces in the `subject` or `body` of a template:
- `{{name}}`
- `{{email}}`
- `{{message}}`
- `{{full_name}}`
- `{{phone_number}}`
- `{{company}}`
- `{{project_details}}`

**Example PATCH Body:**
```json
{
  "subject": "New Alert from {{name}}!",
  "body": "You have a new message: {{message}}"
}
```

## 5. Testing the System
You can test the system manually by running a small script or using a tool like Postman to hit the endpoints above.
