-- migrate:up
CREATE TABLE resources(
    resource_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    resource_uuid BINARY(16) NOT NULL UNIQUE,
    address_id BIGINT UNSIGNED,
    resource_name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    phone VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_resources_address_id FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

-- migrate:down
DROP TABLE IF EXISTS resources;