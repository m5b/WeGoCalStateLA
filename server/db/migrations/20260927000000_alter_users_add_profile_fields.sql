-- migrate:up
ALTER TABLE users
    ADD COLUMN alias VARCHAR(40) NULL AFTER username,
    ADD COLUMN relationship VARCHAR(80) NULL AFTER alias,
    ADD COLUMN interests VARCHAR(240) NULL AFTER relationship;

-- migrate:down
ALTER TABLE users
    DROP COLUMN alias,
    DROP COLUMN relationship,
    DROP COLUMN interests;