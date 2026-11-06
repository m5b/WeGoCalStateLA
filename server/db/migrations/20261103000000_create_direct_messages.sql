-- migrate:up
-- Private messages between two people, plus blocking and reporting.

CREATE TABLE direct_messages (
    message_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    message_uuid BINARY(16) NOT NULL UNIQUE,
    sender_id BIGINT UNSIGNED NOT NULL,
    recipient_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    -- A picture is kept in a private folder (never the public uploads one); this is its path.
    photo_key VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_direct_messages_sender FOREIGN KEY (sender_id) REFERENCES users (user_id),
    CONSTRAINT fk_direct_messages_recipient FOREIGN KEY (recipient_id) REFERENCES users (user_id),
    INDEX idx_direct_messages_pair (sender_id, recipient_id, message_id),
    INDEX idx_direct_messages_inbox (recipient_id, read_at)
);

-- blocker_id will not receive messages from blocked_id, and sees that conversation as blocked.
CREATE TABLE user_blocks (
    blocker_id BIGINT UNSIGNED NOT NULL,
    blocked_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT fk_user_blocks_blocker FOREIGN KEY (blocker_id) REFERENCES users (user_id),
    CONSTRAINT fk_user_blocks_blocked FOREIGN KEY (blocked_id) REFERENCES users (user_id)
);

-- A report sent to the admins. It keeps a copy of the reported message, so the admins can still read
-- it if the sender deletes it afterwards. Only the reported message is shared, not the conversation.
CREATE TABLE message_reports (
    report_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    report_uuid BINARY(16) NOT NULL UNIQUE,
    message_id BIGINT UNSIGNED NOT NULL,
    reporter_id BIGINT UNSIGNED NOT NULL,
    reported_user_id BIGINT UNSIGNED NOT NULL,
    reason VARCHAR(500) NOT NULL,
    message_content TEXT NOT NULL,
    message_photo_key VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by_user_id BIGINT UNSIGNED NULL,
    UNIQUE (message_id, reporter_id),
    CONSTRAINT fk_message_reports_message FOREIGN KEY (message_id) REFERENCES direct_messages (message_id),
    CONSTRAINT fk_message_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (user_id),
    CONSTRAINT fk_message_reports_reported FOREIGN KEY (reported_user_id) REFERENCES users (user_id),
    CONSTRAINT fk_message_reports_resolver FOREIGN KEY (resolved_by_user_id) REFERENCES users (user_id)
);

-- migrate:down
DROP TABLE IF EXISTS message_reports;
DROP TABLE IF EXISTS user_blocks;
DROP TABLE IF EXISTS direct_messages;