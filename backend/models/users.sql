DROP database if exists defaultdb;
CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

DROP TABLE IF EXISTS eventRegistrants;
DROP TABLE IF EXISTS clubEvents;
DROP TABLE IF EXISTS clubAdminApplications;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isBanned BOOLEAN DEFAULT FALSE,
    isSysAdmin BOOLEAN DEFAULT FALSE,
    isVerified BOOLEAN DEFAULT FALSE,
    clubAdminStatus ENUM('never_applied', 'pending', 'accepted', 'rejected') DEFAULT 'never_applied',
    verificationToken VARCHAR(255) DEFAULT NULL,
    img_url VARCHAR(500) DEFAULT NULL
);

INSERT INTO users (name, username, email, password, isBanned, isSysAdmin, isVerified, clubAdminStatus, img_url)
VALUES 
('Alice Smith', 'alice', 'alice@example.com', 'hashed_pw_123', FALSE, FALSE, TRUE, 'accepted', 'https://example.com/images/alice.jpg'),
('Bob Johnson', 'bobby', 'bob@example.com', 'hashed_pw_456', FALSE, FALSE, TRUE, 'never_applied', 'https://example.com/images/bob.jpg'),
('Charlie Brown', 'charlie', 'charlie@example.com', 'hashed_pw_789', TRUE, FALSE, TRUE, 'rejected', 'https://example.com/images/charlie.jpg'),
('Admin One', 'admin1', 'admin1@example.com', 'hashed_admin_pw', FALSE, TRUE, TRUE, 'accepted', 'https://example.com/images/admin1.jpg'),
('Super Admin', 'superadmin', 'superadmin@example.com', 'hashed_super_pw', FALSE, TRUE, TRUE, 'accepted', 'https://example.com/images/superadmin.jpg');


CREATE TABLE clubAdminApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewedBy INT NULL,
    reviewedAt TIMESTAMP NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE clubEvents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('draft', 'upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft',
    title VARCHAR(255) NOT NULL UNIQUE,
    organizer VARCHAR(255) NOT NULL, -- 👈 added here
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    duration INT COMMENT 'Duration in minutes' NOT NULL,
    category ENUM('technology', 'film and photography', 'environment', 'debate', 'career',
    'sports', 'esports', 'business', 'health', 'cultural', 'other') NOT NULL,
    address VARCHAR(255) NOT NULL,
    room VARCHAR(100),
    registration_deadline DATETIME NOT NULL,
    view_count INT DEFAULT 0,
    image_url VARCHAR(500) NOT NULL,
    capacity INT NOT NULL COMMENT 'Maximum number of attendees',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO clubEvents
(title, organizer, status, description, event_date, event_time, duration, category, 
 address, room, registration_deadline, view_count, image_url, capacity)
VALUES
('AI in 2025', 'AI Club', 'upcoming', 'A talk on the future of artificial intelligence and its impact on jobs.', 
 '2025-09-01', '15:00:00', 120, 'technology',
 'University Auditorium, Dhaka', 'Room 101',
 '2025-08-30 23:59:59', 52, 'https://example.com/images/ai_event.jpg', 150),

('Street Photography Basics', 'Photography Society', 'upcoming', 'Learn how to capture stunning street photography with just your phone.', 
 '2025-09-05', '10:00:00', 180, 'film and photography',
 'Fine Arts Building, Dhaka', 'Studio 3',
 '2025-09-03 23:59:59', 30, 'https://example.com/images/photo_event.jpg', 40),

('Climate Change Debate', 'Debate Club', 'ongoing', 'Inter-university debate on climate change and policy.', 
 '2025-08-24', '09:00:00', 240, 'debate',
 'National Debate Hall', 'Hall A',
 '2025-08-20 23:59:59', 110, 'https://example.com/images/debate_event.jpg', 120),

('University Football Tournament', 'Sports Committee', 'upcoming', 'Annual inter-department football tournament.', 
 '2025-09-15', '16:00:00', 120, 'sports',
 'Central Field', NULL,
 '2025-09-10 23:59:59', 200, 'https://example.com/images/football_event.jpg', 300),

('Careers in Business Analytics', 'Business School', 'upcoming', 'Industry experts share career opportunities in data and analytics.', 
 '2025-09-10', '14:00:00', 90, 'career',
 'Business School, Dhaka', 'Conference Room 5',
 '2025-09-08 23:59:59', 75, 'https://example.com/images/career_event.jpg', 60);


CREATE TABLE eventRegistrants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES clubEvents(id) ON DELETE CASCADE,

    -- Ensure a user cannot register twice for the same event
    UNIQUE KEY unique_registration (user_id, event_id)
);

-- User with id 1 registers for event with id 3
INSERT INTO eventRegistrants (user_id, event_id) VALUES (1, 3);

-- User 2 registers for event 1
INSERT INTO eventRegistrants (user_id, event_id) VALUES (2, 1);

-- User 1 registers for event 1
INSERT INTO eventRegistrants (user_id, event_id) VALUES (1, 1);



SELECT * FROM users;
SELECT * FROM clubAdminApplications;
SELECT * FROM clubEvents;
SELECT * FROM eventRegistrants;

-- List all users registered for a specific event (event_id = 1)
SELECT u.id, u.name, u.email
FROM users u
JOIN eventRegistrants ep ON u.id = ep.user_id
WHERE ep.event_id = 1;

-- List all events a user (user_id = 1) registered for
SELECT ep.id AS uid, e.id AS event_id, e.title, e.event_date
FROM clubEvents e
JOIN eventRegistrants ep ON e.id = ep.event_id
WHERE ep.user_id = 1;



