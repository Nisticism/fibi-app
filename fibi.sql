CREATE DATABASE IF NOT EXISTS Fibi;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20),
    last_active_at DATETIME,
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS articles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    created_at DATETIME
);

ALTER TABLE articles ADD author_id INT UNSIGNED NOT NULL AFTER id; 
ALTER TABLE articles ADD CONSTRAINT fk_articles_users_author_id FOREIGN KEY (author_id) REFERENCES users(id);

CREATE TABLE IF NOT EXISTS comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    created_at DATETIME,
    last_updated_at DATETIME
);

ALTER TABLE comments ADD author_id INT UNSIGNED NOT NULL AFTER id; 
ALTER TABLE comments ADD CONSTRAINT fk_comments_users_author_id FOREIGN KEY (author_id) REFERENCES users(id);

ALTER TABLE comments ADD article_id INT UNSIGNED NOT NULL AFTER author_id; 
ALTER TABLE comments ADD CONSTRAINT fk_comments_article_id FOREIGN KEY (article_id) REFERENCES articles(id);

SELECT * from Fibi.users;
SELECT * from Fibi.articles;
SELECT * from Fibi.comments;

SELECT * from Fibi.comments WHERE id = 17;
DELETE FROM Fibi.articles WHERE id < 16;

INSERT INTO Fibi.comments (author_id, article_id, content, created_at, last_updated_at) VALUES (4, 17, "Testing content 3", null, null);