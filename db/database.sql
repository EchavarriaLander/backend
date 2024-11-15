CREATE DATABASE IF NOT EXISTS pelisdb;

USE pelisdb;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_months INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_id INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

CREATE TABLE genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    release_year YEAR,
    video_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    age_rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17') DEFAULT 'PG-13',
    video_qualities JSON DEFAULT NULL COMMENT '{"480p": "url", "720p": "url", "1080p": "url", "4k": "url"}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255),
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE watchlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    movie_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_profiles INT DEFAULT 5,
    max_devices INT DEFAULT 2,
    quality_level ENUM('SD', 'HD', '4K') DEFAULT 'HD',
    can_download BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_plan_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);

INSERT INTO genres (name) VALUES 
('Action'),
('Science Fiction'),
('Drama'),
('Comedy'),
('Horror');

INSERT INTO subscription_plans (name, price, max_profiles, max_devices, quality_level, can_download) VALUES 
('Plan Básico', 9.99, 1, 1, 'SD', false),
('Plan Estándar', 14.99, 2, 2, 'HD', true);

INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url) VALUES 
('The Matrix', 'A computer programmer discovers a mysterious world...', 136, 1999, 'http://example.com/matrix.mp4', 'http://example.com/matrix.jpg'),
('Inception', 'A thief who steals corporate secrets...', 148, 2010, 'http://example.com/inception.mp4', 'http://example.com/inception.jpg'),
('The Dark Knight', 'Batman fights against the Joker...', 152, 2008, 'http://example.com/dark-knight.mp4', 'http://example.com/dark-knight.jpg');

INSERT INTO movie_genres (movie_id, genre_id) VALUES 
(1, 1), -- Matrix - Action
(1, 2), -- Matrix - Sci-Fi
(2, 1), -- Inception - Action
(2, 2), -- Inception - Sci-Fi
(3, 1), -- Dark Knight - Action
(3, 3); -- Dark Knight - Drama