-- migrate:up
CREATE TABLE resource_categories(
    category_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category_uuid BINARY(16) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS resource_categories;