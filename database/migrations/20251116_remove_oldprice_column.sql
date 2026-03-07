-- Remove oldPrice column from products if present
ALTER TABLE products
  DROP COLUMN IF EXISTS oldPrice;
