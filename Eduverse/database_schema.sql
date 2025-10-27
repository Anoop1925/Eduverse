CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    cid VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    noOfChapters INTEGER NOT NULL,
    includeVideo BOOLEAN DEFAULT FALSE,
    level VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    courseJson JSON,
    userEmail VARCHAR(255) REFERENCES users(email) NOT NULL
);

ALTER TABLE courses
ADD COLUMN bannerImageUrl varchar DEFAULT '';


select * from points_history;
SELECT * FROM courses;

UPDATE users
SET display_name = CASE
  WHEN email = '1032220350@tcetmumbai.in' THEN 'Chitra Pandey'
  WHEN email = 'demo@user.com' THEN 'Demo User'
  ELSE display_name
END
WHERE display_name IS NULL;


ALTER TABLE users ADD COLUMN display_name VARCHAR(255);


CREATE TABLE user_progress (
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

CREATE TABLE user_points (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    total_chapters_completed INTEGER DEFAULT 0,
    total_courses_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE points_history (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    chapter_index INTEGER,
    earned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_progress_email_course ON user_progress(user_email, course_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_email, is_completed);
CREATE INDEX idx_points_history_email ON points_history(user_email);
CREATE INDEX idx_points_history_earned_at ON points_history(earned_at DESC);
CREATE INDEX idx_user_points_points ON user_points(points DESC);

INSERT INTO users (email, display_name) VALUES 
    ('test@example.com', 'Test User'),
    ('1032221560@tcetmumbai.in', 'Krunal Parab')
ON CONFLICT (email) DO NOTHING;


INSERT INTO user_points (user_email, points, total_chapters_completed, total_courses_completed) 
VALUES 
    ('test@example.com', 150, 15, 2),
    ('1032221560@tcetmumbai.in', 80, 8, 1),
    ('1032220350@tcetmumbai.in', 200, 20, 3),
    ('demo@user.com', 120, 12, 2)
ON CONFLICT (user_email) DO NOTHING;


INSERT INTO points_history (user_email, points_earned, reason, course_id, chapter_index) 
VALUES 
    ('test@example.com', 10, 'Completed chapter: Introduction to AI', 1, 0),
    ('1032221560@tcetmumbai.in', 10, 'Completed chapter: Machine Learning Basics', 1, 1),
    ('1032220350@tcetmumbai.in', 50, 'Course completed bonus', 1, NULL),
    ('demo@user.com', 10, 'Completed chapter: Getting Started', 2, 0)
ON CONFLICT DO NOTHING;


SELECT id, cid, name FROM courses
INSERT INTO courses (id, cid, name, description, noOfChapters, includeVideo, level, category, courseJson, userEmail)
VALUES
    (1, 'course-001', 'Introduction to AI', 'Learn the basics of AI', 5, TRUE, 'Beginner', 'Technology', '{}', 'test@example.com'),
    (2, 'course-002', 'Machine Learning Basics', 'Fundamentals of ML', 4, FALSE, 'Intermediate', 'Technology', '{}', '1032221560@tcetmumbai.in');

UPDATE points_history
SET course_id = 2
WHERE user_email = '1032221560@tcetmumbai.in' AND reason = 'Completed chapter: Machine Learning Basics';


-- testing
SELECT c.id, c.name, ph.user_email, ph.reason, ph.chapter_index
FROM courses c
JOIN points_history ph ON c.id = ph.course_id;

SELECT * FROM points_history;