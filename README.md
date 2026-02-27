# AfreshCenter API (backend)

Runs on **port 3001**. The frontend proxies `/api` to this server.

## Setup (Postgres)

1. Install dependencies:

```bash
cd AfreshCenter-logic
npm install
```

2. Ensure your Postgres database is created and your tables are applied using your existing `schema.sql` (you mentioned this lives in your admin schema folder).

3. Set `DATABASE_URL` in your environment (standard Postgres connection string).

## Run

```bash
npm run dev
```

- **Health:** `GET http://localhost:3001/health`
- **Admin login (stub):** `POST http://localhost:3001/admin/login`
- **Services:** `GET/POST http://localhost:3001/admin/services`, `PATCH http://localhost:3001/admin/services/:id/visibility`
