# AfreshCenter Email System Explained

This guide provides a technical overview of how emails are handled for **Booking** and **Contact Form** submissions.

## 1. Process Flow

Whenever a user submits a booking or contact form, the following sequence occurs:

1.  **Request Reception**: The API endpoint (`/api/bookings` or `/api/contact`) receives the data.
2.  **Validation**: Middleware validates the input data (name, email, message, etc.).
3.  **Database Storage**: The submission is saved to the database.
4.  **Template Retrieval**: The system fetches the corresponding email template (`booking_notification` or `contact_notification`) from the database.
5.  **Parsing**: Placeholders like `{{name}}` or `{{message}}` in the template are replaced with actual user data.
6.  **Dispatch**: The parsed email is sent using the **Resend** service.

## 2. Where to See Messages

You can view submission details in three places:

### A. Email Inbox
A notification is sent immediately to the address defined in your `.env` as `NOTIFICATION_EMAIL`. If no email is set there, it checks `EMAIL_USER`.

### B. Database Tables (Direct Access)
All messages are stored permanently in your database:
- **Bookings**: Stored in the `bookings` table.
- **Contact Messages**: Stored in the `contact_messages` table.

You can view these tables using a database management tool (like the Supabase Dashboard, pgAdmin, or DBeaver).

### C. API Endpoints
- **For Bookings**: You can fetch all bookings by sending a `GET` request to `/api/bookings`.
- **For Contact Messages**: Currently, these are saved to the database but do not have a public "List All" API endpoint for security (to prevent anyone from reading your messages).

## 3. Key Components

### A. Controllers (The Triggers)
- **Booking**: `src/controllers/booking.controller.js` -> `submitBooking`
- **Contact**: `src/controllers/contact.controller.js` -> `submitContactForm`

These controllers orchestrate the flow: saving to DB first, then calling the email service.

### B. Email Service (The Delivery)
- **File**: `src/services/email.service.js`
- **Function**: `sendEmail(subject, body, to)`

This service uses the **Resend SDK**. It reads the `RESEND_API_KEY` and `EMAIL_FROM` from your environment variables.

### C. Template System (Dynamic Content)
The system uses double curly braces `{{ }}` for dynamic content.

**Available Placeholders:**
- **Contact**: `{{name}}`, `{{email}}`, `{{message}}`
- **Booking**: `{{full_name}}`, `{{email}}`, `{{phone_number}}`, `{{project_details}}`

## 4. Configuration

To ensure emails are sent correctly, configure these in `.env`:

```env
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=onboarding@resend.dev  # Change to your verified domain in production
NOTIFICATION_EMAIL=admin@example.com # Recipient for notifications
```

## 5. How to Customize Email Messages

The message content (Subject and Body) is stored in the database. You can change it at any time by sending a `PATCH` request to the specific template endpoint.

### Customizing Contact Emails
- **Endpoint**: `PATCH /api/contact/template`
- **Example Payload**:
  ```json
  {
    "subject": "New Inquiry: {{name}}",
    "body": "Hello Admin,\n\n{{name}} ({{email}}) just sent a message:\n\n{{message}}"
  }
  ```

### Customizing Booking Emails
- **Endpoint**: `PATCH /api/bookings/template`
- **Example Payload**:
  ```json
  {
    "subject": "Consultation Request - {{full_name}}",
    "body": "You have a new booking from {{full_name}}.\nPhone: {{phone_number}}\nDetails: {{project_details}}"
  }
  ```

### Key Rules for Customization:
1.  **Use Double Braces**: Always wrap field names in `{{ }}` (e.g., `{{name}}`).
2.  **Case Sensitivity**: The names inside the braces must match the field names exactly (e.g., `{{full_name}}` NOT `{{FullName}}`).
3.  **No Code Changes Needed**: Once you update the template via the API, all future emails will use the new format immediately.

## 6. Troubleshooting

- **Email not received**: Check if the `RESEND_API_KEY` is valid.
- **Onboarding limitations**: If using `onboarding@resend.dev`, you can only send to the email you registered with Resend.
- **Template Errors**: Ensure placeholders match the field names sent in the request (e.g., use `{{full_name}}` for bookings, not `{{name}}`).
