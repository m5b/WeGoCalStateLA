-- migrate:up
START TRANSACTION;

-- ======================================
-- USERS (10)
-- ======================================
INSERT INTO
    users (password_hash, email, username, display_name)
VALUES
    (
        'hash_A1',
        'alice@example.com',
        'alice01',
        'Alice'
    ),
    ('hash_B2', 'bob@example.com', 'bob02', 'Bob'),
    (
        'hash_C3',
        'charlie@example.com',
        'charlie03',
        'Charlie'
    ),
    ('hash_D4', 'dana@example.com', 'dana04', 'Dana'),
    ('hash_E5', 'eve@example.com', 'eve05', 'Eve'),
    (
        'hash_F6',
        'frank@example.com',
        'frank06',
        'Frank'
    ),
    (
        'hash_G7',
        'grace@example.com',
        'grace07',
        'Grace'
    ),
    (
        'hash_H8',
        'henry@example.com',
        'henry08',
        'Henry'
    ),
    ('hash_I9', 'ivan@example.com', 'ivan09', 'Ivan'),
    (
        'hash_J10',
        'julia@example.com',
        'julia10',
        'Julia'
    );

-- ======================================
-- THREADS (5)
-- ======================================
INSERT INTO
    threads (user_id, title, content)
VALUES
    (
        1,
        'Welcome Thread',
        'Welcome everyone to WeGoApp!'
    ),
    (
        2,
        'Tips for New Users',
        'Share your best tips here.'
    ),
    (
        3,
        'Let’s Discuss Coding',
        'Talk about programming topics.'
    ),
    (4, 'Favorite Games', 'What games do you play?'),
    (5, 'Random Chat', 'Anything goes here!');

-- ======================================
-- COMMENTS (Thread 1: Multi-level nesting)
-- ======================================
INSERT INTO
    comments (parent_id, user_id, thread_id, content)
VALUES
    (NULL, 2, 1, 'Excited to join!'),
    (1, 3, 1, 'Welcome Bob!'),
    (2, 4, 1, 'Thanks Charlie!'),
    (3, 5, 1, 'This community is awesome.');

-- ======================================
-- Thread 2: Mixed nesting
-- ======================================
INSERT INTO
    comments (parent_id, user_id, thread_id, content)
VALUES
    (NULL, 6, 2, 'First tip: Stay consistent!'),
    (NULL, 7, 2, 'Second tip: Take breaks!'),
    (6, 8, 2, 'Great advice, Grace!'),
    (7, 9, 2, 'Agreed!'),
    (8, 10, 2, 'Ivan is right.');

-- ======================================
-- Thread 3: Heavy replies + nesting
-- ======================================
INSERT INTO
    comments (parent_id, user_id, thread_id, content)
VALUES
    (
        NULL,
        1,
        3,
        'What language is everyone learning?'
    ),
    (10, 2, 3, 'I''m learning Java!'),
    (10, 3, 3, 'Python here.'),
    (12, 4, 3, 'Python is great for beginners.'),
    (12, 5, 3, 'Agreed!'),
    (
        13,
        6,
        3,
        'You''re all motivating me to relearn it.'
    ),
    (15, 7, 3, 'Do it!'),
    (16, 8, 3, 'I can help if needed!');

-- ======================================
-- Thread 4: Flat comments
-- ======================================
INSERT INTO
    comments (parent_id, user_id, thread_id, content)
VALUES
    (NULL, 9, 4, 'I love Elden Ring.'),
    (NULL, 10, 4, 'Stardew Valley forever.'),
    (NULL, 1, 4, 'Minecraft modding is fun.');

-- ======================================
-- Thread 5: Mini-nest
-- ======================================
INSERT INTO
    comments (parent_id, user_id, thread_id, content)
VALUES
    (NULL, 2, 5, 'Random thoughts go here.'),
    (21, 3, 5, 'Here''s one.'),
    (22, 4, 5, 'Here''s another one.');

COMMIT;

-- migrate:down
START TRANSACTION;

-- ======================================
-- DELETE SEEDED COMMENTS
-- ======================================
DELETE FROM
    comments
WHERE
    (user_id, thread_id, content) IN (
        -- Thread 1
        (2, 1, 'Excited to join!'),
        (3, 1, 'Welcome Bob!'),
        (4, 1, 'Thanks Charlie!'),
        (5, 1, 'This community is awesome.'),
        -- Thread 2
        (6, 2, 'First tip: Stay consistent!'),
        (7, 2, 'Second tip: Take breaks!'),
        (8, 2, 'Great advice, Grace!'),
        (9, 2, 'Agreed!'),
        (10, 2, 'Ivan is right.'),
        -- Thread 3
        (1, 3, 'What language is everyone learning?'),
        (2, 3, 'I''m learning Java!'),
        (3, 3, 'Python here.'),
        (4, 3, 'Python is great for beginners.'),
        (5, 3, 'Agreed!'),
        (6, 3, 'You''re all motivating me to relearn it.'),
        (7, 3, 'Do it!'),
        (8, 3, 'I can help if needed!'),
        -- Thread 4
        (9, 4, 'I love Elden Ring.'),
        (10, 4, 'Stardew Valley forever.'),
        (1, 4, 'Minecraft modding is fun.'),
        -- Thread 5
        (2, 5, 'Random thoughts go here.'),
        (3, 5, 'Here''s one.'),
        (4, 5, 'Here''s another one.')
    );

-- ======================================
-- DELETE SEEDED THREADS
-- ======================================
DELETE FROM
    threads
WHERE
    title IN (
        'Welcome Thread',
        'Tips for New Users',
        'Let’s Discuss Coding',
        'Favorite Games',
        'Random Chat'
    );

-- ======================================
-- DELETE SEEDED USERS
-- ======================================
DELETE FROM
    users
WHERE
    email IN (
        'alice@example.com',
        'bob@example.com',
        'charlie@example.com',
        'dana@example.com',
        'eve@example.com',
        'frank@example.com',
        'grace@example.com',
        'henry@example.com',
        'ivan@example.com',
        'julia@example.com'
    );

COMMIT;