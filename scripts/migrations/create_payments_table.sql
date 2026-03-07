-- Payments table for MarzPay mobile money (linked to orders)
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount INT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  reference VARCHAR(64) NOT NULL UNIQUE,
  provider VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  transaction_uuid VARCHAR(64) NULL,
  provider_reference VARCHAR(128) NULL,
  marzpay_response JSON NULL,
  webhook_data JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT chk_payments_amount CHECK (amount > 0),
  CONSTRAINT chk_payments_provider CHECK (provider IN ('mtn', 'airtel')),
  CONSTRAINT chk_payments_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
