-- migrate:up
-- Links an event to the user who created it and to its auto-generated
-- community thread, and adds a spot for an uploaded cover photo URL.
ALTER TABLE events
    ADD COLUMN created_by_user_id BIGINT UNSIGNED NULL AFTER address_id,
    ADD COLUMN thread_id BIGINT UNSIGNED NULL AFTER created_by_user_id,
    ADD COLUMN photo_url VARCHAR(500) NULL AFTER thread_id,
    ADD CONSTRAINT fk_events_created_by_user_id FOREIGN KEY (created_by_user_id) REFERENCES users(user_id),
    ADD CONSTRAINT fk_events_thread_id FOREIGN KEY (thread_id) REFERENCES threads(thread_id);

-- migrate:down
ALTER TABLE events
    DROP FOREIGN KEY fk_events_created_by_user_id,
    DROP FOREIGN KEY fk_events_thread_id,
    DROP COLUMN created_by_user_id,
    DROP COLUMN thread_id,
    DROP COLUMN photo_url;