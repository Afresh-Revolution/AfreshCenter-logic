-- Consolidate card/overview/background image into a single "image" column (used for uploads).
-- Run after 001_add_service_detail_fields.sql if you have the old columns.

-- Add single image column (stores path/URL of uploaded image)
ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT;

-- Migrate existing data: prefer image_url, then background_image_url, then overview_image_url
UPDATE services
SET image = COALESCE(image_url, background_image_url, overview_image_url, image)
WHERE image IS NULL AND (image_url IS NOT NULL OR background_image_url IS NOT NULL OR overview_image_url IS NOT NULL);

-- Drop the three URL columns (IF EXISTS for compatibility)
ALTER TABLE services DROP COLUMN IF EXISTS image_url;
ALTER TABLE services DROP COLUMN IF EXISTS background_image_url;
ALTER TABLE services DROP COLUMN IF EXISTS overview_image_url;
