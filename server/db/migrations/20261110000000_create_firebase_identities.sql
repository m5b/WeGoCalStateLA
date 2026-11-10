-- migrate:up
CREATE TABLE firebase_identities (
    project_id VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    firebase_uid VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, firebase_uid),
    CONSTRAINT fk_firebase_identity_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE firebase_identities;
