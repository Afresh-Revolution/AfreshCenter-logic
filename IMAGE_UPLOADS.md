# 🖼️ Image Uploads — Cloudinary Integration

Images are stored on **Cloudinary** (CDN). The returned URL is saved directly into **Supabase Postgres** (your DB). No images are stored on the server.

---

## ⚙️ Setup

### 1. Get your Cloudinary credentials
1. Sign up / log in at [cloudinary.com](https://cloudinary.com)
2. Go to your **Dashboard** → copy the three values below

### 2. Add to `.env`
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. If on Render
Add the same three variables under **Settings → Environment** in your Render dashboard, then redeploy.

---

## 📡 Upload API

### `POST /api/admin/upload`

> Requires an authenticated admin session (JWT in `Authorization` header).

#### Request

| Property | Value |
|---|---|
| Method | `POST` |
| URL | `/api/admin/upload` |
| Content-Type | `multipart/form-data` |
| Field name | `image` |
| Max file size | **10 MB** |
| Allowed types | JPEG, PNG, GIF, WebP, AVIF, BMP, SVG |

---

### Example — `fetch` (browser / frontend)

```js
const formData = new FormData();
formData.append('image', fileInputElement.files[0]);

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${yourJwtToken}`,
  },
  body: formData,
});

const data = await response.json();
// data.secure_url  → "https://res.cloudinary.com/your_cloud/image/upload/v.../afreshcenter/abc123.jpg"
// data.public_id → "afreshcenter/abc123"
```

---

### Example — `axios` (frontend)

```js
const formData = new FormData();
formData.append('image', file);

const { data } = await axios.post('/api/admin/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
});

console.log(data.secure_url); // save this URL to your DB
```

---

### Example — `curl` (terminal / testing)

```bash
curl -X POST https://your-api.onrender.com/api/admin/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/photo.jpg"
```

---

## ✅ Success Response

```json
{
  "success": true,
  "secure_url": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/afreshcenter/abc123.jpg",
  "public_id": "afreshcenter/abc123"
}
```

| Field | Description |
|---|---|
| `secure_url` | HTTPS CDN link — **save this in your Supabase DB** |
| `public_id` | Cloudinary identifier — useful for deleting or transforming later |

---

## ❌ Error Responses

| Status | Reason |
|---|---|
| `400` | No file sent, wrong file type |
| `400` | File exceeds 10 MB limit |
| `503` | Cloudinary env vars not configured |
| `500` | Cloudinary upload failed (check API credentials) |

---

## 💾 Storing the URL in Supabase

After uploading, save the returned `url` into your table. Example for a **team member**:

```js
const { data: uploadData } = await axios.post('/api/admin/upload', formData, { ... });

await axios.post('/api/teams', {
  name: 'John Doe',
  role: 'Therapist',
  image_url: uploadData.secure_url,   // ← Cloudinary URL stored in Supabase
  bio: '...',
});
```

The `image_url` column in your Supabase table holds the Cloudinary link. When the frontend fetches the team member, it uses `image_url` directly as the `<img src>`.

---

## 🔄 How it works end-to-end

```
Frontend
  │
  │  POST /api/admin/upload  (multipart/form-data)
  ▼
Express Server  ──── streams buffer ────▶  Cloudinary
                                               │
                                    returns secure_url
                                               │
  ◀──────────────── { success, secure_url, public_id } ──────────┘
  │
  │  saves url to Supabase DB
  ▼
Supabase Postgres
  (stores the Cloudinary URL string, not the image itself)
```

---

## 🖼️ Displaying Images

Use the URL from the DB directly in your frontend:

```jsx
<img src={member.image_url} alt={member.name} />
```

Cloudinary URLs support **on-the-fly transformations** via URL params:

```
// Resize to 400x400, auto quality, WebP format
https://res.cloudinary.com/your_cloud/image/upload/w_400,h_400,c_fill,q_auto,f_webp/afreshcenter/abc123
```

---

## 🗑️ Deleting an Image (optional)

If you store the `public_id`, you can delete from Cloudinary via the API:

```js
import { v2 as cloudinary } from 'cloudinary';
await cloudinary.uploader.destroy('afreshcenter/abc123');
```
