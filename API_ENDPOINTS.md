# AfreshCenter API Endpoints

This document provides a comprehensive list of all available API endpoints in the AfreshCenter backend.

## Base URL
The API is accessible via:
- `http://localhost:3001/` (Local Development)

---

## 1. System Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check service and database connectivity. |
| GET | `/api/health` | Alternative health check endpoint. |

---

## 2. Admin Authentication
Prefix: `/admin` or `/api/admin`

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| POST | `/login` | Admin login to receive JWT token. | `{ "email": "...", "password": "...", "rememberMe": boolean }` |

---

## 3. Admin Service Management (Postgres)
Prefix: `/admin/services` or `/api/admin/services`

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| GET | `/` | List all services. | N/A |
| POST | `/` | Create a new service. | `{ "title": "...", "category": "...", "priceRange": "...", "visible": boolean }` |
| PATCH | `/:id` | Update an existing service. | `{ "title": "...", "category": "...", "priceRange": "...", "visible": boolean }` (all optional) |
| PATCH | `/:id/visibility` | Toggle service visibility. | `{ "visible": boolean }` (optional) |
| DELETE | `/:id` | Delete a service. | N/A |

---

## 4. Contact Us
Prefix: `/api/contact`

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| POST | `/` | Submit a contact message. | `{ "name": "...", "email": "...", "phone": "...", "subject": "...", "message": "..." }` |
| GET | `/template` | Get the contact email template. | N/A |
| PATCH | `/template` | Update the contact email template. | `{ "subject": "...", "body": "..." }` |

---

## 5. Teams Management
Prefix: `/api/teams`

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| GET | `/` | List all team members. | N/A |
| GET | `/:id` | Get a specific team member. | N/A |
| POST | `/` | Add a new team member. | `{ "name": "...", "role": "...", "bio": "...", "image_url": "..." }` |
| PATCH | `/:id` | Update a team member. | `{ "name": "...", "role": "...", "bio": "...", "image_url": "..." }` (all optional) |
| DELETE | `/:id` | Remove a team member. | N/A |

---

## 6. Booking Sessions
Prefix: `/api/bookings`

| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| GET | `/` | List all bookings (Admin). | N/A |
| POST | `/` | Submit a new session booking. | `{ "full_name": "...", "email": "...", "phone_number": "...", "company": "...", "project_details": "..." }` |
| GET | `/template` | Get the booking notification template. | N/A |
| PATCH | `/template` | Update the booking notification template. | `{ "subject": "...", "body": "..." }` |

---

## Notes
- **Authentication**: Admin endpoints (login, services, templates) may require a JWT token (implementation in progress for some routes).
- **Email Service**: Contact and Booking notifications use the **Resend** SDK.
- **Database**: All operations (except MongoDB specific ones if any) are performed on **PostgreSQL via Supabase**.
