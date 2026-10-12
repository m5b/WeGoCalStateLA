-- migrate:up
-- Lets a thread belong to a category (general/events/faq) so the Community
-- feed can filter by tab. Events' auto-created companion threads are
-- tagged 'events', so they naturally appear in that category.
ALTER TABLE threads
    ADD COLUMN category ENUM('general','events','faq') NOT NULL DEFAULT 'general' AFTER title;

-- migrate:down
ALTER TABLE threads
    DROP COLUMN category;