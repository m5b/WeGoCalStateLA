-- migrate:up
CREATE TABLE users (
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_uuid BINARY(16) NOT NULL UNIQUE,
    password_hash varchar(255),
    email_hash BINARY(32) UNIQUE,
    username varchar(100) UNIQUE,
    display_name varchar(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    account_status ENUM('pending_verification', 'active', 'deactivated') DEFAULT 'pending_verification'
);

-- migrate:down
DROP TABLE IF EXISTS users;