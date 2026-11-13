-- migrate:up
-- Closing a direct message conversation hides it from your list without deleting any messages (like
-- closing a DM in Discord). It comes back when you open it again, or when a message is sent in it after
-- you closed it.
CREATE TABLE conversation_closures (
    user_id BIGINT UNSIGNED NOT NULL,
    other_id BIGINT UNSIGNED NOT NULL,
    closed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, other_id),
    CONSTRAINT fk_conversation_closures_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_conversation_closures_other FOREIGN KEY (other_id) REFERENCES users (user_id)
);

-- migrate:down
DROP TABLE IF EXISTS conversation_closures;