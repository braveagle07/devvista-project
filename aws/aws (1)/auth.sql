-- ============================================================
--  DevVista -- Authentication Database Schema
--  Tables: users, login_sessions
--
--  CREDENTIAL MATCHING FLOW
--  ========================
--  1. SIGNUP  : INSERT a row into users with bcrypt(password) stored
--               in password_hash. The email is unique -- duplicate
--               signups are rejected.
--  2. LOGIN   : SELECT the row WHERE email = ?. Then compare the
--               submitted password against the stored password_hash
--               using bcrypt.verify(). Only on a match is a session
--               created. This ensures login only works with the EXACT
--               credentials used at signup.
-- ============================================================

-- Drop tables if they already exist (for clean re-runs)
DROP TABLE IF EXISTS login_sessions;
DROP TABLE IF EXISTS users;

-- ============================================================
--  TABLE: users
--  Stores signup / account registration data
-- ============================================================
CREATE TABLE users (
    id              INT             NOT NULL AUTO_INCREMENT,
    full_name       VARCHAR(120)    NOT NULL,
    email           VARCHAR(180)    NOT NULL UNIQUE,
    -- IMPORTANT: Always store the bcrypt/argon2 hash -- NEVER plain text
    password_hash   VARCHAR(255)    NOT NULL,
    provider        ENUM('email', 'google', 'github')
                                    NOT NULL DEFAULT 'email',
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE  KEY uq_users_email (email),
    INDEX   idx_users_provider (provider)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores all registered DevVista user accounts';

-- ============================================================
--  TABLE: login_sessions
--  Created only AFTER credentials are verified at login
-- ============================================================
CREATE TABLE login_sessions (
    session_id      VARCHAR(128)    NOT NULL,
    user_id         INT             NOT NULL,
    ip_address      VARCHAR(45)     DEFAULT NULL,
    user_agent      VARCHAR(512)    DEFAULT NULL,
    logged_in_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME        NOT NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    PRIMARY KEY (session_id),
    INDEX   idx_sessions_user   (user_id),
    INDEX   idx_sessions_active (is_active),
    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tracks active login sessions -- only created on verified login';

-- ============================================================
--  SAMPLE DATA  (password_hash = bcrypt of "Password@1")
-- ============================================================
INSERT INTO users (full_name, email, password_hash, provider) VALUES
    ('Alice Johnson',  'alice@example.com',  '.abcde', 'email'),
    ('Bob Smith',      'bob@example.com',    '.abcde', 'email'),
    ('Carol Williams', 'carol@example.com',  '.abcde', 'email');

INSERT INTO login_sessions (session_id, user_id, ip_address, user_agent, logged_in_at, expires_at) VALUES
    ('sess_abc123', 1, '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/124', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY)),
    ('sess_def456', 2, '10.0.0.5',     'Mozilla/5.0 (Macintosh) Safari/17',        NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));

-- ============================================================
--  QUERIES -- CREDENTIAL MATCHING FLOW
-- ============================================================

-- STEP 1: SIGNUP -- Register new user
--   Backend must hash password before inserting:
--   hash = bcrypt.hash(plainPassword, saltRounds=12)
-- INSERT INTO users (full_name, email, password_hash)
--     VALUES (?, ?, ?);

-- STEP 2: LOGIN -- Fetch stored hash for the entered email
-- SELECT id, full_name, password_hash
--     FROM users
--     WHERE email = ? AND is_active = 1;
--   Then in application code:
--   if bcrypt.verify(enteredPassword, row.password_hash)  --> credentials match
--   else --> reject login ("Incorrect password")

-- STEP 3: Create session only on successful credential match
-- INSERT INTO login_sessions (session_id, user_id, ip_address, user_agent, expires_at)
--     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- STEP 4: Validate session (on each protected page load)
-- SELECT u.id, u.full_name, u.email
--     FROM login_sessions s
--     JOIN users u ON u.id = s.user_id
--     WHERE s.session_id = ? AND s.is_active = 1 AND s.expires_at > NOW();

-- STEP 5: Logout -- invalidate session
-- UPDATE login_sessions SET is_active = 0 WHERE session_id = ?;
