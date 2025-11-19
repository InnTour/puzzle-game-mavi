-- MAVI Puzzle Game Database Schema
-- Cloudflare D1 (SQLite)

-- Puzzles table
CREATE TABLE IF NOT EXISTS puzzles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    is_featured INTEGER DEFAULT 0,
    difficulty_available TEXT NOT NULL, -- JSON array: ["easy", "medium", "hard"]
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    metadata TEXT -- JSON: { total_plays, avg_time, etc }
);

-- Puzzle pieces URLs (stored per difficulty)
CREATE TABLE IF NOT EXISTS puzzle_pieces (
    id TEXT PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
    piece_index INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE,
    UNIQUE(puzzle_id, difficulty, piece_index)
);

-- Scores / Leaderboard
CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
    score INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    moves INTEGER NOT NULL,
    completed_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE
);

-- Admin users (simple auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'editor')),
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    last_login INTEGER
);

-- Session tokens (for admin auth)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_puzzles_status ON puzzles(status);
CREATE INDEX IF NOT EXISTS idx_puzzles_featured ON puzzles(is_featured);
CREATE INDEX IF NOT EXISTS idx_puzzles_category ON puzzles(category);
CREATE INDEX IF NOT EXISTS idx_pieces_puzzle ON puzzle_pieces(puzzle_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_scores_puzzle ON scores(puzzle_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_scores_leaderboard ON scores(puzzle_id, difficulty, score DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Insert default admin user
-- Password: mavi2025 (hashed with bcrypt - will be set during deployment)
INSERT OR IGNORE INTO admin_users (id, email, password_hash, name, role) 
VALUES (
    'admin-001', 
    'admin@mavi.com',
    '$2a$10$placeholder', -- Will be replaced with real hash
    'MAVI Admin',
    'admin'
);

-- Insert sample puzzle for testing
INSERT OR IGNORE INTO puzzles (
    id, 
    title, 
    description, 
    category, 
    image_url, 
    thumbnail_url,
    status, 
    is_featured, 
    difficulty_available,
    metadata
) VALUES (
    'puzzle-sample-001',
    'Lacedonia 1957 - Piazza Centrale',
    'Fotografia storica della piazza centrale di Lacedonia nel 1957',
    'Storia',
    '/images/sample-puzzle.jpg',
    '/images/sample-puzzle-thumb.jpg',
    'published',
    1,
    '["easy","medium","hard"]',
    '{"total_plays":0,"avg_time":0,"avg_score":0}'
);
