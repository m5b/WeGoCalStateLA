-- migrate:up
    CREATE TABLE anonymous_name (
        user_id INT UNSIGNED NOT NULL,
        anonymous_name VARCHAR(255) NOT NULL,
        taken TINYINT(1) NOT NULL DEFAULT 0,
        CONSTRAINT fk_anonymous_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE

    );

-- migrate:down
DROP TABLE IF EXISTS anonymous_name;

