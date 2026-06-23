-- Closed Circuit: demo_videos table (admin-managed feature demonstration videos)
-- Auto-created on backend startup via schema.js; this file is for manual reference.

CREATE TABLE IF NOT EXISTS demo_videos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  video_url VARCHAR(1024) NOT NULL,
  video_key VARCHAR(512) NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_demo_videos_display_order (display_order ASC),
  INDEX idx_demo_videos_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
