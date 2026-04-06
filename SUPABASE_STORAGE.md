# Supabase Storage — Image Upload Setup

This document explains how image uploads work in AfreshCenter-logic and what you need to set up to make them work in production.

---

## Why Supabase Storage?

The backend is hosted on **Render**. Render's filesystem is **ephemeral** — any files written to disk (like uploaded images) are wiped whenever the server restarts or redeploys.

To fix this, images are now uploaded directly to **Supabase Storage**, which is permanent cloud storage. Images uploaded once will always be accessible regardless of server restarts.

---

## How it works

```
Admin uploads image
       │
       ▼
POST /api/admin/upload
       │
       ▼
multer (memory storage — no disk write)
       │
       ▼
Supabase Storage bucket ("uploads")
       │
       ▼
Returns permanent public URL:
https://xxxx.supabase.co/storage/v1/object/public/uploads/filename.jpg
       │
       ▼
URL saved to DB (services.image / team_members.image_url)
       │
       ▼
Frontend displays image from Supabase CDN
```

---

## Files Changed

| File | What Changed |
|------|-------------|
| `src/routes/upload.js` | Replaced multer disk storage with Supabase Storage (memory buffer → Supabase bucket) |
| `src/config/supabase.js` | New file — creates and exports the Supabase client |
| `package.json` | Added `@supabase/supabase-js` dependency |
| `.env.example` | Added `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_STORAGE_BUCKET` |

---

## One-Time Setup (Do This Once)

### 1. Create the Storage Bucket in Supabase

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **AfreshCenter project**
3. In the left sidebar → click **Storage**
4. Click **New bucket**
5. Set **Name** to: `uploads`
6. Toggle **Public bucket** → **ON** (so images are accessible without auth)
7. Click **Create bucket**

### 2. Get Your Supabase Keys

1. In the Supabase dashboard → **Project Settings** (gear icon, bottom left)
2. Click **API**
3. Copy the following:
   - **Project URL** → `https://xxxx.supabase.co`
   - **service_role** secret key → starts with `eyJhb...`

> ⚠️ Use the **service_role** key (not the anon key). The service role key bypasses Row Level Security so the server can write to storage without restrictions. **Never expose this key on the frontend.**

### 3. Add Environment Variables to Render

1. Go to your [Render dashboard](https://dashboard.render.com)
2. Select your backend service (**afreshcenter-logic**)
3. Click **Environment** in the left menu
4. Add these three variables:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhb...your-service-role-key` |
| `SUPABASE_STORAGE_BUCKET` | `uploads` |

5. Click **Save Changes** — Render will automatically redeploy

### 4. Deploy the Backend Changes

If Render didn't auto-deploy, push the changes manually:

```bash
cd AfreshCenter-logic
git add -A
git commit -m "feat: Supabase Storage for persistent image uploads + team crud fixes"
git push
```

Render will detect the push and redeploy automatically.

---

## Local Development

For local development, create a `.env` file in `AfreshCenter-logic/` (copy from `.env.example`):

```env
PORT=3001
DATABASE_URL=postgresql://...your-supabase-connection-string...
JWT_SECRET=any_local_secret

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhb...your-service-role-key
SUPABASE_STORAGE_BUCKET=uploads
```

Then run:
```bash
npm install
npm run dev
```

---

## Verifying It Works

After deployment:

1. Log in to the admin panel
2. Go to **Services** → **Add New Service** or edit an existing one
3. Click the image upload zone and select a file
4. The image should preview immediately in the modal
5. Save the service
6. Open the public site — the service card should show the image
7. Restart/redeploy the backend on Render
8. Reload the public site — the image should **still be there** ✅

---

## Notes

- **Max file size**: 10 MB per image
- **Accepted formats**: JPEG, PNG, GIF, WebP, AVIF, BMP, SVG
- **Existing images**: Services that already had `/uploads/...` paths in the database may show broken images if those files no longer exist on Render's disk. Re-upload images for those services via the admin panel to get permanent Supabase URLs.
- **Bucket policy**: The bucket is set to public so no authentication is needed to view images. Only the backend (using the service role key) can upload new images.
