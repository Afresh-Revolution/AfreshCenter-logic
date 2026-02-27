# Connecting to the database (Supabase Postgres)

The backend connects to Postgres using **only** `DATABASE_URL` and the `postgres` package. No Supabase URL or anon key is used.

## 1. Environment variables

In the `AfreshCenter-logic` folder, create a `.env` file (do not commit it):

```env
DATABASE_URL=postgresql://postgres.dhyrhcdsspzvsrbtirfk:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-jwt-secret
PORT=3001
```

- **DATABASE_URL**: From Supabase Dashboard → Project Settings → **Database** → **Connection string** → URI, **Session mode**. Replace `[YOUR-PASSWORD]` with your database password.
- **JWT_SECRET**: Any long random string used to sign admin JWTs. Use a strong secret in production.

## 2. Create the admin user (first time)

Run the seed script to create the `admin_users` table and the first admin user:

```bash
npm run seed-admin
```

This uses `DATABASE_URL` from `.env`. Optional env vars:

- `ADMIN_EMAIL` (default: `afreshcenter@gmail.com`)
- `ADMIN_PASSWORD` (default: `AfrESH2026@Rev`)

So with defaults, after seeding you can sign in with:

| Field      | Value                   |
|-----------|-------------------------|
| **Email** | `afreshcenter@gmail.com` |
| **Password** | `AfrESH2026@Rev`      |

## 3. Run the backend

```bash
npm install
npm run dev
```

Server runs on **http://localhost:3001**.

## 4. Login API

- **Endpoint:** `POST http://localhost:3001/admin/login`
- **Body (JSON):**

  ```json
  {
    "email": "afreshcenter@gmail.com",
    "password": "AfrESH2026@Rev",
    "rememberMe": false
  }
  ```

- **Success (200):** Returns `success: true`, `session.access_token` (JWT), and `user` (id, email). Use the token in the `Authorization: Bearer <access_token>` header for protected routes.
- **Validation (400):** Invalid email/password format; response includes `errors` array.
- **Auth (401):** Invalid email or password.

Your frontend should POST to this URL with the form data and store the returned `access_token` for authenticated requests.
