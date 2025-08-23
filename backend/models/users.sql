DROP database if exists defaultdb;
CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS clubAdminApplications;

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
    verificationToken VARCHAR(255) DEFAULT NULL
);

INSERT INTO users (name, username, email, password, isBanned, isSysAdmin, isVerified, clubAdminStatus)
VALUES 
('Alice Smith', 'alice', 'alice@example.com', 'hashed_pw_123', FALSE, FALSE, TRUE, 'accepted'),
('Bob Johnson', 'bobby', 'bob@example.com', 'hashed_pw_456', FALSE, FALSE, TRUE, 'never_applied'),
('Charlie Brown', 'charlie', 'charlie@example.com', 'hashed_pw_789', TRUE, FALSE, TRUE, 'rejected'),
('Admin One', 'admin1', 'admin1@example.com', 'hashed_admin_pw', FALSE, TRUE, TRUE, 'accepted'),
('Super Admin', 'superadmin', 'superadmin@example.com', 'hashed_super_pw', FALSE, TRUE, TRUE, 'accepted');

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

SELECT * FROM users;
SELECT * FROM clubAdminApplications;
