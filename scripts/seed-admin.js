/**
 * Creates admin_users table (if missing) and seeds the first admin user.
 * Run: node scripts/seed-admin.js
 * Requires: DATABASE_URL in .env; optional ADMIN_EMAIL, ADMIN_PASSWORD.
 */

import 'dotenv/config';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL ?? 'afreshcenter@gmail.com';
const password = process.env.ADMIN_PASSWORD ?? 'AfrESH2026@Rev';

if (!connectionString) {
  console.error('Set DATABASE_URL in .env');
  process.exit(1);
}

const sql = postgres(connectionString);

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email)`;

  const password_hash = bcrypt.hashSync(password, 10);
  await sql`
    INSERT INTO admin_users (email, password_hash)
    VALUES (${email}, ${password_hash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;

  console.log('Admin user ready:', email);
  await sql.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
