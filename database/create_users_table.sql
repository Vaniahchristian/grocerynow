-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create wishlist table for user favorites
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Create user sessions table for JWT token management (optional)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Insert sample users for testing (passwords are hashed for 'password123')
INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code) VALUES
('john.doe@example.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'John', 'Doe', '+1234567890', '123 Main St', 'New York', '10001'),
('jane.smith@example.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'Jane', 'Smith', '+1234567891', '456 Oak Ave', 'Los Angeles', '90210'),
('admin@centurygroceries.com', '$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ', 'Admin', 'User', '+1234567892', '789 Admin St', 'Chicago', '60601')
ON DUPLICATE KEY UPDATE email = email;
