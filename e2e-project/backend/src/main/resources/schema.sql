-- This file runs when the Java app starts (see spring.sql.init.mode in application.properties).
-- SQL = Structured Query Language: the language you use to talk to PostgreSQL.
--
-- A table is like a spreadsheet:
--   - each COLUMN is a field (id, title, done, created_at)
--   - each ROW is one todo

CREATE TABLE IF NOT EXISTS todos (
    -- BIGSERIAL: PostgreSQL gives us 1, then 2, then 3, ... automatically.
    -- PRIMARY KEY: this value uniquely identifies one row. No two todos share an id.
    id         BIGSERIAL PRIMARY KEY,

    -- TEXT: the words the user typed. NOT NULL means we refuse a todo without a title.
    title      TEXT        NOT NULL,

    -- BOOLEAN: true = finished, false = still open. DEFAULT FALSE = new todos start open.
    done       BOOLEAN     NOT NULL DEFAULT FALSE,

    -- TIMESTAMP: when the row was inserted. DEFAULT NOW() = database fills this in.
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);
