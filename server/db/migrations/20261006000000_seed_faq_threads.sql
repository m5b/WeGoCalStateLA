-- migrate:up
-- Moves the FAQs from hardcoded client placeholders into the database as
-- real threads (category 'faq'), posted by a login-less "WeGo Community
-- Team" account (no password or email, so nobody can sign in as it).
INSERT INTO users (user_uuid, username, created_at, updated_at)
SELECT UUID_TO_BIN(UUID()), 'WeGo Community Team', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'WeGo Community Team');

-- For FAQs, title is the question and content is the answer.
INSERT INTO threads (user_id, thread_uuid, title, content, category)
SELECT u.user_id, UUID_TO_BIN(UUID()), f.title, f.content, 'faq'
FROM users u
JOIN (
    SELECT 'How do I find important dates like registration and financial-aid deadlines?' AS title,
           'Check the Cal State LA academic calendar and the Events tab here for upcoming deadlines and reminders.' AS content
    UNION ALL
    SELECT 'Where can my student get mental health or wellness support on campus?',
           'The Student Health Center and counseling services offer free support. See the Events tab for wellness workshops.'
    UNION ALL
    SELECT 'Can family members attend campus events?',
           'Many events are open to families. Check each event''s details for who can attend.'
) f
WHERE u.username = 'WeGo Community Team';

-- migrate:down
DELETE c FROM comments c
    JOIN threads t ON c.thread_id = t.thread_id
    JOIN users u ON t.user_id = u.user_id
    WHERE u.username = 'WeGo Community Team';
DELETE t FROM threads t
    JOIN users u ON t.user_id = u.user_id
    WHERE u.username = 'WeGo Community Team';
DELETE FROM users WHERE username = 'WeGo Community Team';