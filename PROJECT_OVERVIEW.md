# Project Overview: AfreshCenter-logic

This document provides a comprehensive overview of the **AfreshCenter-logic** backend project, its architecture, configuration, and recent developments.

## 1. Project Purpose
The AfreshCenter-logic is a Node.js-based backend API service designed to handle core business logic, administrative tasks, and database interactions for the AfreshCenter ecosystem. It primarily manages admin authentication, service visibility, and integration with PostgreSQL (via Supabase) and optionally MongoDB.

## 2. Core Technology Stack
- **Runtime**: Node.js (v22+)
- **Web Framework**: Express.js
- **Databases**:
  - **PostgreSQL**: Primary relational database used for admin users and core data.
  - **MongoDB/Mongoose**: Configured as a secondary/optional data store.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for password hashing.
- **Validation**: `Joi` for schema-based request validation.
- **Development Tools**: `nodemon` for automatic server restarts.

## 3. Architecture & File Structure
- `src/server.js`: The entry point that initializes the HTTP server and database connections.
- `src/app.js`: Configures Express middleware, routes, and error handlers.
- `src/config/`: Contains configuration modules, specifically `db.js` for database connectivity.
- `src/routes/`: Organized into distinct modules (e.g., `admin`, `api`) to manage various endpoints.
- `scripts/`: Utility scripts for maintenance or administrative tasks.

## 4. Configuration & Settings
A `.env` file should be located in the root directory to manage sensitive settings.

### Key Environment Variables:
- `PORT`: The port on which the server runs (Default: `3001`).
- `DATABASE_URL`: The connection string for the PostgreSQL database (e.g., Supabase URI).
- `JWT_SECRET`: A secret string used for signing and verifying authentication tokens.
- `MONGODB_URI`: (Optional) The connection string for the MongoDB instance.

## 5. Getting Started
1. **Installation**: `npm install`
2. **Database Seeding**: (If applicable) Run scripts to initialize the database schema and admin users.
3. **Execution**:
   - Development: `npm run dev`
   - Production: `npm start`

## 6. Recent Project Updates (February 2026)
Significant work has been done recently to stabilize the project environment:
- **JSON Correction**: Fixed corruption and encoding issues in `package.json`.
- **Git Synchronization**: Resolved complex merge conflicts and rebasing issues across `package.json`, `package-lock.json`, and `.gitignore`.
- **Dependency Fixes**: Restored missing modules (like `readdirp`) and ensured clean installations.
- **Server Optimization**: Fixed port collision issues and ensured reliable health check reporting.
- **Environment Security**: Ensured `.env` and `node_modules` are properly ignored in version control.

## 7. Useful Endpoints
- **Health Check**: `GET /health`
- **Admin Login**: `POST /admin/login`
- **Admin Services**: `GET/POST /admin/services`
- **Service Visibility**: `PATCH /admin/services/:id/visibility`

---
*Date of Overview: February 27, 2026*
