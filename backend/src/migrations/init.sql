-- Complete database initialization script for PostgreSQL
-- This script creates all tables, indexes, and initial data

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    extension VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_language_id ON generations(language_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);

-- Seed languages
INSERT INTO languages (name, extension) VALUES
    ('Python', '.py'),
    ('JavaScript', '.js'),
    ('TypeScript', '.ts'),
    ('C++', '.cpp'),
    ('Java', '.java'),
    ('Go', '.go'),
    ('Rust', '.rs'),
    ('C#', '.cs'),
    ('PHP', '.php'),
    ('Ruby', '.rb')
ON CONFLICT (name) DO NOTHING;

-- Create demo user
INSERT INTO users (username, email) VALUES
    ('demo', 'demo@example.com')
ON CONFLICT (email) DO NOTHING;

-- Verify tables
SELECT 'Tables created successfully' AS status;
SELECT COUNT(*) AS language_count FROM languages;
SELECT COUNT(*) AS user_count FROM users;
