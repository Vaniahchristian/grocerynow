-- Adds delivery breakdown columns to orders table and backfills data

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS deliveryZone VARCHAR(100) NULL AFTER location,
  ADD COLUMN IF NOT EXISTS subtotal INT NOT NULL DEFAULT 0 AFTER notes,
  ADD COLUMN IF NOT EXISTS deliveryFee INT NOT NULL DEFAULT 0 AFTER subtotal;

-- Backfill subtotal for existing rows where it's zero but total exists
UPDATE orders
SET subtotal = total
WHERE (subtotal IS NULL OR subtotal = 0) AND total IS NOT NULL;

-- Ensure total equals subtotal + deliveryFee
UPDATE orders
SET total = COALESCE(subtotal, 0) + COALESCE(deliveryFee, 0);
