-- migrate:up
CREATE TABLE event_photos(
    event_photo_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT UNSIGNED NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_photos_event_id FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTS event_photos;