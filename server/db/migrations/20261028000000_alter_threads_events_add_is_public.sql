-- migrate:up
-- Lets a thread or event be public (shown in full to signed-out visitors)
-- or private (signed-out visitors only see that it exists). Defaults to
-- private, so nothing that already exists becomes visible to signed-out
-- visitors. FAQs are curated help content, so they start out public.
ALTER TABLE threads
    ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE AFTER category;

ALTER TABLE events
    ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE AFTER photo_url;

UPDATE threads SET is_public = TRUE WHERE category = 'faq';

-- migrate:down
ALTER TABLE events
    DROP COLUMN is_public;

ALTER TABLE threads
    DROP COLUMN is_public;
