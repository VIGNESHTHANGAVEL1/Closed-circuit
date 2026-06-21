-- Closed Circuit: contacts table (production contact form storage)
-- Run against your MySQL database (default: cc_db)

CREATE DATABASE IF NOT EXISTS cc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cc_db;

CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  mobileNumber VARCHAR(50) NOT NULL,
  emailId VARCHAR(255) NOT NULL,
  town VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  lookingFor VARCHAR(255) NOT NULL,
  preferredContactMethod VARCHAR(100) NOT NULL,
  preferredDate VARCHAR(50) NOT NULL,
  preferredTime VARCHAR(50) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_contacts_created_at (created_at DESC),
  INDEX idx_contacts_email (emailId),
  INDEX idx_contacts_mobile (mobileNumber),
  INDEX idx_contacts_full_name (fullName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
