-- migrate:up
-- Remembers when a reply's text was last changed, so the page can show "edited" next to it.
-- Written so it is safe to run on a database that already has the column.
SET @has_edited := (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'comments' AND column_name = 'edited_at'
);
SET @add_edited := IF(@has_edited = 0,
    'ALTER TABLE comments ADD COLUMN edited_at TIMESTAMP NULL',
    'SELECT 1');
PREPARE add_edited_stmt FROM @add_edited;
EXECUTE add_edited_stmt;
DEALLOCATE PREPARE add_edited_stmt;

-- migrate:down
ALTER TABLE comments DROP COLUMN edited_at;