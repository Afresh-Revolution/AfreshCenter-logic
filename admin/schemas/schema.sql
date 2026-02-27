-- Postgres schema for admin services
-- Apply this file to your Postgres database.
-- Requires UUID support (e.g. `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
-- or `uuid-ossp` depending on your setup).

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  price_range text NOT NULL DEFAULT '',
  total_bookings integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

