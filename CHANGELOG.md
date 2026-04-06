# Changelog

All notable changes to AfreshCenter-logic are documented here.

---

## [Unreleased] — 2026-04-06

### ✨ Features Added

#### Booking Status Management
- Added a `status` column to the `bookings` table with a default value of `'Pending'`.
- Supported status values: `Pending`, `Confirmed`, `Completed`, `Cancelled`.
- Added `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` migration guard so existing deployments are updated automatically on server start.
- Added `updateBookingStatus(id, status)` model function with a whitelist check to prevent invalid status values.
- Added `PATCH /api/bookings/:id/status` route to allow admins to update a booking's status.
- Added `updateStatus` handler in `booking.controller.js` to wire the route to the model.

#### Supabase Storage for Image Uploads (`src/routes/upload.js`)
- Integrated **Supabase Storage** as the primary image storage backend so uploaded images **persist across Render restarts** (previously stored on local disk which is ephemeral on Render).
- Supabase client is initialised lazily at startup using:
  - `SUPABASE_URL` — Your Supabase project URL
  - `SUPABASE_SERVICE_KEY` — Your Supabase service role key
  - `SUPABASE_STORAGE_BUCKET` — Bucket name (defaults to `uploads`)
- If those env vars are **not** set, the server falls back silently to **local disk storage** with a console warning.
- When Supabase is active, multer uses `memoryStorage()` and the file buffer is uploaded directly to Supabase Storage.
- The endpoint returns the **public CDN URL** from Supabase instead of a relative `/uploads/...` path.
- Added `src/config/supabase.js` for the shared Supabase client config.
- Added `SUPABASE_STORAGE.md` with full setup instructions.

---

### 🐛 Bug Fixes

#### Booking Route Ordering (`src/routes/booking.route.js`)
- Fixed a route conflict where `GET /api/bookings/template` was being matched as `GET /api/bookings/:id` (treating `"template"` as an ID).
- Moved static routes (`/template`, `/:id/status`) **above** the dynamic `/:id` route to ensure correct matching.

#### Team Middleware Validation (`src/middleware/team.middleware.js`)
- Removed `.uri()` validation from the `image_url` field in the update schema.
  - **Reason:** The upload endpoint returns relative paths like `/uploads/abc123.jpg`, which are not valid absolute URIs and were failing Joi validation, causing 400 errors on team member updates after upload.
- Added `visible: Joi.boolean().optional()` to the team member update schema to support toggling visibility from the admin panel.

---

### 📁 Files Changed

| File | Change |
|---|---|
| `src/app.js` | Staged change (route wiring) |
| `src/models/booking.model.js` | Added `status` column + `updateBookingStatus()` |
| `src/controllers/booking.controller.js` | Added `updateStatus` handler |
| `src/routes/booking.route.js` | Fixed route ordering, added status route |
| `src/routes/upload.js` | Integrated Supabase Storage with local disk fallback |
| `src/middleware/team.middleware.js` | Fixed `image_url` validation, added `visible` field |
| `src/models/team.model.js` | Supporting model changes |
| `src/routes/team.route.js` | Supporting route changes |
| `src/config/supabase.js` | *(New)* Shared Supabase client |
| `SUPABASE_STORAGE.md` | *(New)* Setup guide for Supabase Storage |
| `.env.example` | Added `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_STORAGE_BUCKET` |
| `package.json` / `package-lock.json` | Added `@supabase/supabase-js` dependency |

---

### 🔧 Environment Variables Added

Add these to your `.env` (and Render environment variables) to enable Supabase Storage:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=uploads
```

> See `SUPABASE_STORAGE.md` for the full setup guide including how to create the bucket and set permissions.

---

### 📌 Related Docs
- [SUPABASE_STORAGE.md](./SUPABASE_STORAGE.md) — Supabase Storage setup guide
- [SUPABASE_CONNECTION.md](./SUPABASE_CONNECTION.md) — Supabase DB connection guide
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) — Full API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment guide
