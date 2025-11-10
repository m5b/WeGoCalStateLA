-- migrate:up
CREATE TABLE users (
    user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    password_hash varchar(255),
    email varchar(100) UNIQUE,
    username varchar(100) UNIQUE,
    display_name varchar(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    google_id varchar(64) UNIQUE,
    deleted_at TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS users;