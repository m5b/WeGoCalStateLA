-- migrate:up
-- Lets a thread or comment be posted without an account -- user_id null
-- means "posted anonymously" (shown as "Anonymous" by the API).
ALTER TABLE threads MODIFY COLUMN user_id BIGINT UNSIGNED NULL;
ALTER TABLE comments MODIFY COLUMN user_id BIGINT UNSIGNED NULL;

-- migrate:down
ALTER TABLE threads MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL;
ALTER TABLE comments MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL;