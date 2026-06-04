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
};
