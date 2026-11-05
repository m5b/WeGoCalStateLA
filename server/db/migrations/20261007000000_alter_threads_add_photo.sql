-- migrate:up
-- Lets a community post carry a cover photo. Written so it is safe to run on a
-- database that already has the column.
SET @has_photo := (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'threads' AND column_name = 'photo_url'
);
SET @add_photo := IF(@has_photo = 0,
    'ALTER TABLE threads ADD COLUMN photo_url VARCHAR(500) NULL AFTER category',
    'SELECT 1');
PREPARE add_photo_stmt FROM @add_photo;
EXECUTE add_photo_stmt;
DEALLOCATE PREPARE add_photo_stmt;

-- migrate:down
ALTER TABLE threads DROP COLUMN photo_url;