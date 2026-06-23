export const TABLE_DEFINITIONS = {
  admin_users: {
    createSql: `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_admin_users_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'username', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'password_hash', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'role', definition: "VARCHAR(50) NOT NULL DEFAULT 'admin'" },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  contacts: {
    createSql: `
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
        status VARCHAR(50) NULL DEFAULT 'New',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_contacts_created_at (created_at DESC),
        INDEX idx_contacts_email (emailId),
        INDEX idx_contacts_mobile (mobileNumber),
        INDEX idx_contacts_full_name (fullName),
        INDEX idx_contacts_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'fullName', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'mobileNumber', definition: 'VARCHAR(50) NOT NULL' },
      { name: 'emailId', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'town', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'state', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'country', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'lookingFor', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'preferredContactMethod', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'preferredDate', definition: 'VARCHAR(50) NOT NULL' },
      { name: 'preferredTime', definition: 'VARCHAR(50) NOT NULL' },
      { name: 'description', definition: 'TEXT NULL' },
      { name: 'status', definition: "VARCHAR(50) NULL DEFAULT 'New'" },
      { name: 'client_reminder_email_sent', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'client_reminder_sms_sent', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'admin_reminder_email_sent', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'admin_reminder_sms_sent', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'reminder_sent_at', definition: 'DATETIME NULL' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
    ],
    postMigrate: async (pool) => {
      await pool.query(
        "UPDATE contacts SET status = 'New' WHERE status IS NULL OR status = ''"
      );
    },
    indexes: [{ name: 'idx_contacts_status', columns: 'status' }],
  },
  clients: {
    createSql: `
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
        domain_url VARCHAR(1024) NULL,
        display_status TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_clients_name (name),
        INDEX idx_clients_mobile (mobile_number),
        INDEX idx_clients_email (email_id),
        INDEX idx_clients_type (client_type),
        INDEX idx_clients_business_type (business_type),
        INDEX idx_clients_onboard_date (onboard_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'name', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'mobile_number', definition: 'VARCHAR(50) NOT NULL' },
      { name: 'email_id', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'address', definition: 'TEXT NULL' },
      { name: 'client_type', definition: "ENUM('b2b', 'b2c') NOT NULL" },
      { name: 'business_type', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'onboard_date', definition: 'DATE NOT NULL' },
      { name: 'client_logo_key', definition: 'VARCHAR(512) NULL' },
      { name: 'client_logo_url', definition: 'VARCHAR(1024) NULL' },
      { name: 'client_profile_pic_key', definition: 'VARCHAR(512) NULL' },
      { name: 'client_profile_pic_url', definition: 'VARCHAR(1024) NULL' },
      { name: 'domain_url', definition: 'VARCHAR(1024) NULL' },
      { name: 'display_status', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  sms_templates: {
    createSql: `
      CREATE TABLE IF NOT EXISTS sms_templates (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        template_key VARCHAR(100) NOT NULL,
        template_id VARCHAR(100) NOT NULL,
        template_name VARCHAR(255) NOT NULL,
        sender_id VARCHAR(50) NULL,
        template_content TEXT NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_sms_templates_key (template_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'template_key', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'template_id', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'template_name', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'sender_id', definition: 'VARCHAR(50) NULL' },
      { name: 'template_content', definition: 'TEXT NOT NULL' },
      { name: 'is_active', definition: 'TINYINT(1) NOT NULL DEFAULT 1' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  email_templates: {
    createSql: `
      CREATE TABLE IF NOT EXISTS email_templates (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        template_key VARCHAR(100) NOT NULL,
        template_name VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        html_content MEDIUMTEXT NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_email_templates_key (template_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'template_key', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'template_name', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'subject', definition: 'VARCHAR(500) NOT NULL' },
      { name: 'html_content', definition: 'MEDIUMTEXT NOT NULL' },
      { name: 'is_active', definition: 'TINYINT(1) NOT NULL DEFAULT 1' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  notification_logs: {
    createSql: `
      CREATE TABLE IF NOT EXISTS notification_logs (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        tenant_id INT UNSIGNED NULL,
        inquiry_id INT UNSIGNED NULL,
        recipient_type ENUM('CLIENT', 'ADMIN') NOT NULL,
        channel ENUM('EMAIL', 'SMS') NOT NULL,
        notification_type ENUM(
          'OTP_VERIFICATION',
          'EMAIL_VERIFICATION_SUCCESS',
          'INQUIRY_SUBMISSION',
          'CALL_REMINDER'
        ) NOT NULL,
        recipient_name VARCHAR(255) NULL,
        recipient_email VARCHAR(255) NULL,
        recipient_mobile VARCHAR(50) NULL,
        template_key VARCHAR(100) NOT NULL,
        template_id VARCHAR(100) NULL,
        status ENUM('SENT', 'FAILED', 'SKIPPED') NOT NULL,
        provider_response VARCHAR(500) NULL,
        error_message VARCHAR(500) NULL,
        sent_at DATETIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_notification_logs_inquiry (inquiry_id),
        INDEX idx_notification_logs_type (notification_type),
        INDEX idx_notification_logs_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'tenant_id', definition: 'INT UNSIGNED NULL' },
      { name: 'inquiry_id', definition: 'INT UNSIGNED NULL' },
      { name: 'recipient_type', definition: "ENUM('CLIENT', 'ADMIN') NOT NULL" },
      { name: 'channel', definition: "ENUM('EMAIL', 'SMS') NOT NULL" },
      {
        name: 'notification_type',
        definition: "ENUM('OTP_VERIFICATION', 'EMAIL_VERIFICATION_SUCCESS', 'INQUIRY_SUBMISSION', 'CALL_REMINDER') NOT NULL",
      },
      { name: 'recipient_name', definition: 'VARCHAR(255) NULL' },
      { name: 'recipient_email', definition: 'VARCHAR(255) NULL' },
      { name: 'recipient_mobile', definition: 'VARCHAR(50) NULL' },
      { name: 'template_key', definition: 'VARCHAR(100) NOT NULL' },
      { name: 'template_id', definition: 'VARCHAR(100) NULL' },
      { name: 'status', definition: "ENUM('SENT', 'FAILED', 'SKIPPED') NOT NULL" },
      { name: 'provider_response', definition: 'VARCHAR(500) NULL' },
      { name: 'error_message', definition: 'VARCHAR(500) NULL' },
      { name: 'sent_at', definition: 'DATETIME NULL' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  verification_otps: {
    createSql: `
      CREATE TABLE IF NOT EXISTS verification_otps (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        channel ENUM('MOBILE', 'EMAIL') NOT NULL,
        identifier VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        otp_hash VARCHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_verification_otps_lookup (channel, identifier, expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'channel', definition: "ENUM('MOBILE', 'EMAIL') NOT NULL" },
      { name: 'identifier', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'client_name', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'otp_hash', definition: 'VARCHAR(64) NOT NULL' },
      { name: 'expires_at', definition: 'DATETIME NOT NULL' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
    ],
  },
  demo_videos: {
    createSql: `
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'title', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'video_url', definition: 'VARCHAR(1024) NOT NULL' },
      { name: 'video_key', definition: 'VARCHAR(512) NULL' },
      { name: 'display_order', definition: 'INT UNSIGNED NOT NULL DEFAULT 1' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      },
    ],
  },
  verification_sessions: {
    createSql: `
      CREATE TABLE IF NOT EXISTS verification_sessions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        token VARCHAR(64) NOT NULL,
        channel ENUM('MOBILE', 'EMAIL') NOT NULL,
        identifier VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_verification_sessions_token (token),
        INDEX idx_verification_sessions_lookup (channel, identifier, expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    columns: [
      { name: 'id', definition: 'INT UNSIGNED NOT NULL AUTO_INCREMENT' },
      { name: 'token', definition: 'VARCHAR(64) NOT NULL' },
      { name: 'channel', definition: "ENUM('MOBILE', 'EMAIL') NOT NULL" },
      { name: 'identifier', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'client_name', definition: 'VARCHAR(255) NOT NULL' },
      { name: 'expires_at', definition: 'DATETIME NOT NULL' },
      {
        name: 'created_at',
        definition: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
      },
    ],
  },
};
