-- migrate:up
CREATE TABLE users (
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_uuid BINARY(16) NOT NULL UNIQUE,
    username varchar(100) NOT NULL UNIQUE,
    user_type ENUM('student', 'faculty', 'family', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
    
);

-- migrate:down
DROP TABLE IF EXISTS users;