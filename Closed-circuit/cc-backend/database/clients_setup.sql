-- Closed Circuit: clients table (admin-managed, independent from enquiries)
USE cc_db;

CREATE TABLE IF NOT EXISTS clients (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(50) NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  address TEXT NULL,
  client_type ENUM('b2b', 'b2c') NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  onboard_date DATE NOT NULL,
  client_logo_key VARCHAR(512) NULL,
  client_logo_url VARCHAR(1024) NULL,
  client_profile_pic_key VARCHAR(512) NULL,
  client_profile_pic_url VARCHAR(1024) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_clients_name (name),
  INDEX idx_clients_mobile (mobile_number),
  INDEX idx_clients_email (email_id),
  INDEX idx_clients_type (client_type),
  INDEX idx_clients_business_type (business_type),
  INDEX idx_clients_onboard_date (onboard_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
