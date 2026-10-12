-- migrate:up
-- Events no longer collect or store a location, so address_id is no longer
-- required (left nullable rather than dropped, since it's already live).
ALTER TABLE events
    MODIFY COLUMN address_id BIGINT UNSIGNED NULL;

-- migrate:down
ALTER TABLE events
    MODIFY COLUMN address_id BIGINT UNSIGNED NOT NULL;