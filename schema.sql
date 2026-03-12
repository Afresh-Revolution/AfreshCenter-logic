-- SQL Schema for Services Table
-- This table is managed via PostgreSQL (Supabase)

CREATE TABLE IF NOT EXISTS services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    category        TEXT DEFAULT 'General',
    price_range     TEXT,
    image_url       TEXT,
    description     TEXT,
    total_bookings  INTEGER DEFAULT 0,
    visible         BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for faster ordering by creation date
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services (created_at DESC);
