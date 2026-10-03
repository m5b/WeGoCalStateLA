-- migrate:up
ALTER TABLE users
    ADD COLUMN email_hash VARCHAR(255) NULL UNIQUE AFTER username,
    ADD COLUMN password_hash VARCHAR(255) NULL AFTER email_hash,
    ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0 AFTER password_hash;

-- migrate:down
ALTER TABLE users
    DROP COLUMN email_hash,
    DROP COLUMN password_hash,
    DROP COLUMN is_admin;