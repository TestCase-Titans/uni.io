CREATE DATABASE defaultdb;
USE defaultdb;
DROP TABLE users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isBanned BOOLEAN DEFAULT FALSE,
    isSysAdmin BOOLEAN DEFAULT FALSE
);

INSERT INTO users (name, username, email, password, isBanned, isSysAdmin)
VALUES ('Alice Smith', 'alice', 'alice@example.com', 'hashed_pw_123', FALSE, FALSE);
INSERT INTO users (name, username, email, password, isBanned, isSysAdmin)
VALUES ('Bob Johnson', 'bobby', 'bob@example.com', 'hashed_pw_456', FALSE, FALSE);
INSERT INTO users (name, username, email, password, isBanned, isSysAdmin)
VALUES ('Charlie Brown', 'charlie', 'charlie@example.com', 'hashed_pw_789', TRUE, FALSE);
INSERT INTO users (name, username, email, password, isBanned, isSysAdmin)
VALUES ('Admin One', 'admin1', 'admin1@example.com', 'hashed_admin_pw', FALSE, TRUE);
INSERT INTO users (name, username, email, password, isBanned, isSysAdmin)
VALUES ('Super Admin', 'superadmin', 'superadmin@example.com', 'hashed_super_pw', FALSE, TRUE);


SELECT * FROM users;