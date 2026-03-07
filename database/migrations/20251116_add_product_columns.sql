-- Adds optional columns to support galleries and variants on products
-- Compatible with MySQL 8+ (uses IF NOT EXISTS). If running on older MySQL, remove the IF NOT EXISTS clauses and run once.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images LONGTEXT NULL AFTER image,
  ADD COLUMN IF NOT EXISTS variants LONGTEXT NULL AFTER images;
