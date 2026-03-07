-- Create offers table for Grocery Now Store
-- This table stores promotional offers and deals

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) DEFAULT NULL,
    discount VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    link VARCHAR(255) DEFAULT '#',
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_active ON offers(isActive);
CREATE INDEX idx_offers_created ON offers(created_at);

-- Insert sample offers data
INSERT INTO offers (title, description, image, discount, category, link, isActive) VALUES
(
    'Weekend Freshness Deal',
    'Get 15% off all fresh produce this weekend! Limited time offer on fruits and vegetables.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop',
    '15% OFF',
    'Fresh Produce',
    '/products?category=Fresh%20Produce',
    TRUE
),
(
    'Dairy & Eggs Bundle',
    'Buy any 2 dairy products and get a dozen eggs absolutely free! Perfect for families.',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=250&fit=crop',
    'FREE EGGS',
    'Dairy & Eggs',
    '/products?category=Dairy%20%26%20Eggs',
    TRUE
),
(
    'Bulk Pantry Savings',
    'Save 10% when you buy 3 or more pantry staples. Stock up and save big!',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop',
    '10% OFF',
    'Pantry Staples',
    '/products?category=Pantry%20Staples',
    TRUE
),
(
    'Meat Lover\'s Special',
    '20% off on all premium meat and fresh seafood products this week only.',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=250&fit=crop',
    '20% OFF',
    'Meat & Seafood',
    '/products?category=Meat%20%26%20Seafood',
    TRUE
),
(
    'Beverage Bonanza',
    'Buy 2 get 1 free on all beverages! Refresh yourself with our premium drinks.',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=250&fit=crop',
    'BUY 2 GET 1 FREE',
    'Beverages',
    '/products?category=Beverages',
    TRUE
),
(
    'Snack Attack Deal',
    'Mix and match any 5 snacks for just UGX 25,000. Perfect for movie nights!',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=250&fit=crop',
    '5 FOR UGX 25K',
    'Snacks',
    '/products?category=Snacks',
    TRUE
);

-- Display the created table structure
DESCRIBE offers;
