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
    duration INT NOT NULL, -- in minutes
    release_year YEAR,
    video_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
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

CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating ENUM('thumbs_up', 'thumbs_down') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE viewing_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    movie_id INT NOT NULL,
    watched_time INT NOT NULL, -- tiempo en segundos
    completed BOOLEAN DEFAULT FALSE,
    last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE viewing_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    movie_id INT NOT NULL,
    progress_seconds INT NOT NULL DEFAULT 0,
    last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

INSERT INTO genres (name) VALUES 
('Action'),
('Science Fiction'),
('Drama'),
('Comedy'),
('Horror');