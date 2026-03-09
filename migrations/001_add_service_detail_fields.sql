-- Add detail fields for service landing/detail page (hero, overview, key features, benefits, deliverables).
-- Run this against your services table. If the table does not exist, create it first with base columns.

-- Add new columns (all nullable for existing rows)
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS background_image_url TEXT,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS overview_image_url TEXT,
  ADD COLUMN IF NOT EXISTS key_features TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT,
  ADD COLUMN IF NOT EXISTS what_you_get TEXT;

-- key_features, benefits, what_you_get: store as newline-separated text; app will split into arrays.
