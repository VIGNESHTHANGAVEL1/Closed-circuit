-- Add status column to contacts (enquiry) table
USE cc_db;

-- Run once; skip if status column already exists
ALTER TABLE contacts
  ADD COLUMN status VARCHAR(50) NULL DEFAULT 'New' AFTER description;

UPDATE contacts SET status = 'New' WHERE status IS NULL OR status = '';

CREATE INDEX idx_contacts_status ON contacts (status);
