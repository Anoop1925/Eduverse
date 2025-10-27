-- Database Migration for Supabase
-- This file contains the complete database schema for the LMS application

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY
);

-- Add display_name column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    cid VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    description VARCHAR(255),
    noOfChapters INTEGER NOT NULL,
    includeVideo BOOLEAN DEFAULT FALSE,
    level VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    courseJson JSON,
    userEmail VARCHAR(255) REFERENCES users(email) NOT NULL,
    bannerImageUrl VARCHAR(255) DEFAULT ''
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    chapter_index INTEGER NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, course_id, chapter_index)
);

-- Create user_points table
CREATE TABLE IF NOT EXISTS user_points (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    total_chapters_completed INTEGER DEFAULT 0,
    total_courses_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Create points_history table
CREATE TABLE IF NOT EXISTS points_history (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    chapter_index INTEGER,
    earned_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_email_course ON user_progress(user_email, course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(user_email, is_completed);
CREATE INDEX IF NOT EXISTS idx_points_history_email ON points_history(user_email);
CREATE INDEX IF NOT EXISTS idx_points_history_earned_at ON points_history(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_points ON user_points(points DESC);
ALTER TABLE courses
ADD CONSTRAINT courses_cid_key UNIQUE (cid);

-- Insert sample data
INSERT INTO users (email, display_name) VALUES 
    ('test@example.com', 'Test User'),
    ('1032221560@tcetmumbai.in', 'Krunal Parab'),
    ('1032220350@tcetmumbai.in', 'Chitra Pandey'),
    ('demo@user.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses (let Postgres auto-generate id)
INSERT INTO courses (cid, name, description, noOfChapters, includeVideo, level, category, courseJson, userEmail, bannerImageUrl) VALUES
    ('course-001', 'Introduction to AI', 'Learn the basics of AI', 5, TRUE, 'Beginner', 'Technology', '{"name":"Introduction to AI","description":"Learn the basics of AI","category":"Technology","level":"Beginner","includeVideo":true,"noOfChapters":5,"chapters":[]}', 'test@example.com', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'),
    ('course-002', 'Machine Learning Basics', 'Fundamentals of ML', 4, FALSE, 'Intermediate', 'Technology', '{"name":"Machine Learning Basics","description":"Fundamentals of ML","category":"Technology","level":"Intermediate","includeVideo":false,"noOfChapters":4,"chapters":[]}', '1032221560@tcetmumbai.in', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800')
ON CONFLICT (cid) DO NOTHING;

-- Insert sample user points
INSERT INTO user_points (user_email, points, total_chapters_completed, total_courses_completed) VALUES 
    ('test@example.com', 150, 15, 2),
    ('1032221560@tcetmumbai.in', 80, 8, 1),
    ('1032220350@tcetmumbai.in', 200, 20, 3),
    ('demo@user.com', 120, 12, 2)
ON CONFLICT (user_email) DO NOTHING;

-- Insert sample points history
INSERT INTO points_history (user_email, points_earned, reason, course_id, chapter_index) VALUES 
    ('test@example.com', 10, 'Completed chapter: Introduction to AI', 1, 0),
    ('1032221560@tcetmumbai.in', 10, 'Completed chapter: Machine Learning Basics', 1, 1),
    ('1032220350@tcetmumbai.in', 50, 'Course completed bonus', 1, NULL),
    ('demo@user.com', 10, 'Completed chapter: Getting Started', 2, 0)
ON CONFLICT DO NOTHING;

-- Update points history with correct course_id
UPDATE points_history
SET course_id = 2
WHERE user_email = '1032221560@tcetmumbai.in' AND reason = 'Completed chapter: Machine Learning Basics'; 

DELETE FROM users WHERE email IN ( '1032221560@tcetmumbai.in [blocked]',  'test@example.com [blocked]', 'demo@user.com [blocked]' );

INSERT INTO users (email, display_name) VALUES ('1032220350@tcetmumbai.in [blocked]', 'Chitra Pandey'), ON CONFLICT will skip ('1032220210@tcetmumbai.in [blocked]', 'Sudeep Sarkar'), ('1032221362@tcetmumbai.in [blocked]', 'Anoop Patel') ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name;

-- 1) Delete all rows from user_points and users (safe order to avoid FK issues) 
TRUNCATE TABLE user_points, points_history, user_progress RESTART IDENTITY CASCADE;

-- 2) Insert 10 Indian users into users 
INSERT INTO users (email, display_name) VALUES ('1032220350@tcetmumbai.in [blocked]', 'Chitra Pandey'), ('1032220210@tcetmumbai.in [blocked]', 'Sudeep Sarkar'), ('1032221362@tcetmumbai.in [blocked]', 'Anoop Patel'), ('amit.kumar@example.com [blocked]', 'Amit Kumar'), ('rajesh.sharma@example.com [blocked]', 'Rajesh Sharma'), ('neha.patel@example.com [blocked]', 'Neha Patel'), ('vikas.singh@example.com [blocked]', 'Vikas Singh'), ('poonam.verma@example.com [blocked]', 'Poonam Verma'), ('sunita.rao@example.com [blocked]', 'Sunita Rao'), ('arjun.mehta@example.com [blocked]', 'Arjun Mehta') ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name;

-- 3) Insert corresponding user_points rows with sample point values so leaderboard is ordered -- Adjust points as desired. These examples create a descending leaderboard. 
INSERT INTO user_points (user_email, points, total_chapters_completed, total_courses_completed, created_at, last_updated) VALUES ('1032220350@tcetmumbai.in [blocked]', 950, 95, 9, NOW(), NOW()),  ('1032220210@tcetmumbai.in [blocked]', 820, 82, 8, NOW(), NOW()), ('1032221362@tcetmumbai.in [blocked]', 760, 76, 7, NOW(), NOW()),
('amit.kumar@example.com [blocked]', 700, 70, 7, NOW(), NOW()), 
('rajesh.sharma@example.com [blocked]', 650, 65, 6, NOW(), NOW()), 
('neha.patel@example.com [blocked]', 600, 60, 6, NOW(), NOW()), 
('vikas.singh@example.com [blocked]', 550, 55, 5, NOW(), NOW()), 
('poonam.verma@example.com [blocked]', 500, 50, 5, NOW(), NOW()), 
('sunita.rao@example.com [blocked]', 450, 45, 4, NOW(), NOW()), 
('arjun.mehta@example.com [blocked]', 400, 40, 4, NOW(), NOW()) ON CONFLICT (user_email) DO UPDATE SET points = EXCLUDED.points, total_chapters_completed = EXCLUDED.total_chapters_completed, total_courses_completed = EXCLUDED.total_courses_completed, last_updated = EXCLUDED.last_updated;

-- 4) Optional: verify top 10 leaderboard 
SELECT u.email, u.display_name, COALESCE(p.points,0) AS points FROM users u LEFT JOIN user_points p ON p.user_email = u.email ORDER BY points DESC, u.display_name LIMIT 10;

-- 3) Insert or update user_points with example point values (descending for leaderboard) 
INSERT INTO user_points (user_email, points, total_chapters_completed, total_courses_completed, created_at, last_updated) VALUES ('1032220350@tcetmumbai.in [blocked]', 950, 95, 9, NOW(), NOW()),  ('1032220210@tcetmumbai.in [blocked]', 820, 82, 8, NOW(), NOW()),  ('1032221362@tcetmumbai.in [blocked]', 760, 76, 7, NOW(), NOW()),  ('amit.kumar@example.com [blocked]', 700, 70, 7, NOW(), NOW()), ('rajesh.sharma@example.com [blocked]', 650, 65, 6, NOW(), NOW()), ('neha.patel@example.com [blocked]', 600, 60, 6, NOW(), NOW()), ('vikas.singh@example.com [blocked]', 550, 55, 5, NOW(), NOW()), ('poonam.verma@example.com [blocked]', 500, 50, 5, NOW(), NOW()), ('sunita.rao@example.com [blocked]', 450, 45, 4, NOW(), NOW()), ('arjun.mehta@example.com [blocked]', 400, 40, 4, NOW(), NOW()) ON CONFLICT (user_email) DO UPDATE SET points = EXCLUDED.points, total_chapters_completed = EXCLUDED.total_chapters_completed, total_courses_completed = EXCLUDED.total_courses_completed, last_updated = EXCLUDED.last_updated, created_at = LEAST(user_points.created_at, EXCLUDED.created_at); -- keep earliest creation time


-- 4) Populate points_history to reflect the initial point assignments -- Assumes points_history has columns: id (serial), user_email, delta, reason, current_points, created_at -- If your schema differs, adjust column names accordingly. 
-- INSERT INTO points_history (user_email, delta, reason, current_points, created_at) VALUES ('1032220350@tcetmumbai.in [blocked]', 950, 'Initial seed points', 950, NOW()), ('1032220210@tcetmumbai.in [blocked]', 820, 'Initial seed points', 820, NOW()), ('1032221362@tcetmumbai.in [blocked]', 760, 'Initial seed points', 760, NOW()), ('amit.kumar@example.com [blocked]', 700, 'Initial seed points', 700, NOW()), ('rajesh.sharma@example.com [blocked]', 650, 'Initial seed points', 650, NOW()), ('neha.patel@example.com [blocked]', 600, 'Initial seed points', 600, NOW()), ('vikas.singh@example.com [blocked]', 550, 'Initial seed points', 550, NOW()), ('poonam.verma@example.com [blocked]', 500, 'Initial seed points', 500, NOW()), ('sunita.rao@example.com [blocked]', 450, 'Initial seed points', 450, NOW()), ('arjun.mehta@example.com [blocked]', 400, 'Initial seed points', 400, NOW());

-- 5) Verify top 10 leaderboard 
SELECT u.email, u.display_name, COALESCE(p.points,0) AS points FROM users u LEFT JOIN user_points p ON p.user_email = u.email ORDER BY points DESC, u.display_name LIMIT 10;