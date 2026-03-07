-- Align product categories with UI categories
-- UI categories (from lib/category-data.ts): Fruits, Greens&Vegetables, Spices, Herbs, Diary&Poultry, Meat&Seafood
-- Run these in order. Adjust "Fresh Produce" mapping if you prefer Fruits for some items.

-- 1. Meat & Seafood → Meat&Seafood
UPDATE products SET category = 'Meat&Seafood' WHERE category = 'Meat & Seafood';

-- 2. Dairy & Eggs → Diary&Poultry
UPDATE products SET category = 'Diary&Poultry' WHERE category = 'Dairy & Eggs';

-- 3. Fresh Produce → Greens&Vegetables (default for all produce)
--    If you want some items under Fruits instead, run the Fruits UPDATE below for those product names, then run this for the rest.
UPDATE products SET category = 'Greens&Vegetables' WHERE category = 'Fresh Produce';

-- 4. Pantry Staples → Spices (UI has no "Pantry Staples"; use Herbs instead if you prefer)
UPDATE products SET category = 'Spices' WHERE category = 'Pantry Staples';

-- Optional: move specific produce items to Fruits (run after the block above if you want to split)
-- UPDATE products SET category = 'Fruits' WHERE category = 'Greens&Vegetables' AND name IN ('Red Apples', 'Banana', 'Avocado', 'Pineapple', 'Watermelon', 'Mangoes', 'Passion Fruits', 'Tanagrine');

-- Verify
-- SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY category;
