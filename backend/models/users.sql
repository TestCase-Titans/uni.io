CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

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
    verificationToken VARCHAR(255) DEFAULT NULL
);

INSERT INTO users (name, username, email, password, isBanned, isSysAdmin, isVerified)
VALUES 
('Alice Smith', 'alice', 'alice@example.com', 'hashed_pw_123', FALSE, FALSE, TRUE),
('Bob Johnson', 'bobby', 'bob@example.com', 'hashed_pw_456', FALSE, FALSE, TRUE),
('Charlie Brown', 'charlie', 'charlie@example.com', 'hashed_pw_789', TRUE, FALSE, TRUE),
('Admin One', 'admin1', 'admin1@example.com', 'hashed_admin_pw', FALSE, TRUE, TRUE),
('Super Admin', 'superadmin', 'superadmin@example.com', 'hashed_super_pw', FALSE, TRUE, TRUE);

SELECT * FROM users;
