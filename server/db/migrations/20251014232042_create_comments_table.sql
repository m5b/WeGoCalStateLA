-- migrate:up
CREATE TABLE comments (
    comment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_uuid BINARY(16) UNIQUE NOT NULL,
    parent_comment_id BIGINT UNSIGNED,
    user_id INT UNSIGNED NOT NULL,
    thread_id BIGINT UNSIGNED NOT NULL,
    content TEXT(40000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    CONSTRAINT fk_comments_parent FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_thread FOREIGN KEY (thread_id) REFERENCES threads (thread_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTS comments;