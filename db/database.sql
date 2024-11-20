CREATE DATABASE IF NOT EXISTS pelisdb;

USE pelisdb;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quality VARCHAR(50),
    resolution VARCHAR(50),
    devices TEXT,
    downloads INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    card_holder VARCHAR(100) NOT NULL,
    expiration_date VARCHAR(5) NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_plan_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);

CREATE TABLE user_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subscription_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES subscription_plans(id)
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
    video_qualities JSON DEFAULT NULL,
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
    is_kids BOOLEAN DEFAULT FALSE,
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

-- Insert initial data
INSERT INTO subscription_plans (name, price, quality, resolution, devices, downloads) VALUES
('Básico', 3000, 'Buena', '720p (HD)', 'TV, computadora, teléfono, tablet', 1),
('Estándar', 5000, 'Óptima', '4k (Ultra HD) + HDR', 'TV, computadora, teléfono, tablet', 2);

INSERT INTO genres (name) VALUES 
('Action'),
('Science Fiction'),
('Drama'),
('Comedy'),
('Horror');

-- Películas de Acción
INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url, age_rating) VALUES
('John Wick', 'Un exasesino a sueldo busca vengar la muerte de su perro, un regalo de su esposa fallecida.', 101, 2014, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/johnwick.jpg', 'R'),
('Mad Max: Fury Road', 'En un mundo posapocalíptico, un fugitivo y una guerrera rebelde luchan contra un tirano por la libertad.', 120, 2015, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/madmax.jpg', 'R'),
('Gladiator', 'Un general romano traicionado busca vengar la muerte de su familia como gladiador.', 155, 2000, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/gladiator.jpg', 'R'),
('The Dark Knight', 'Batman enfrenta al Joker, un villano caótico que desestabiliza Ciudad Gótica.', 152, 2008, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/darkknight.jpg', 'PG-13'),
('Taken', 'Un exagente de la CIA rastrea a su hija secuestrada en Europa.', 90, 2008, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/taken.jpg', 'PG-13');

-- Películas de Comedia
INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url, age_rating) VALUES
('Superbad', 'Dos adolescentes intentan conseguir alcohol para una fiesta y viven un sinfín de aventuras hilarantes.', 113, 2007, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/superbad.jpg', 'R'),
('Dumb and Dumber', 'Dos amigos increíblemente torpes se embarcan en un viaje para devolver un maletín perdido.', 107, 1994, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/dumb.jpg', 'PG-13'),
('The Hangover', 'Tres amigos despiertan tras una loca despedida de soltero sin recordar nada y buscan al novio perdido.', 100, 2009, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/hangover.jpg', 'R'),
('Mean Girls', 'Una adolescente nueva se enfrenta al mundo feroz de las "chicas populares" en su instituto.', 97, 2004, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/meangirls.jpg', 'PG-13'),
('Napoleon Dynamite', 'Un joven excéntrico ayuda a su amigo a ganar la presidencia del consejo estudiantil.', 96, 2004, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/napoleon.jpg', 'PG-13');

-- Películas de Drama
INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url, age_rating) VALUES
('Forrest Gump', 'La vida extraordinaria de un hombre simple que se cruza con momentos históricos icónicos.', 142, 1994, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/forrest.jpg', 'PG-13'),
('The Pursuit of Happyness', 'Un hombre lucha por superar la pobreza mientras cuida de su hijo pequeño.', 117, 2006, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/pursuit.jpg', 'PG-13'),
('The Shawshank Redemption', 'Dos presos forjan una amistad en una cárcel mientras planean su libertad.', 142, 1994, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/shawshank.jpg', 'R'),
('A Star is Born', 'Una joven cantante asciende a la fama mientras su mentor lidia con sus propios demonios.', 136, 2018, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/star.jpg', 'R'),
('12 Years a Slave', 'La historia real de un hombre libre capturado y vendido como esclavo en el siglo XIX.', 134, 2013, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/12years.jpg', 'R');

-- Películas de Horror
INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url, age_rating) VALUES
('The Conjuring', 'Una familia busca la ayuda de investigadores paranormales para enfrentar una entidad maligna.', 112, 2013, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/conjuring.jpg', 'R'),
('Hereditary', 'Una familia enfrenta secretos oscuros y eventos aterradores tras la muerte de su abuela.', 127, 2018, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/hereditary.jpg', 'R'),
('It', 'Un grupo de niños enfrenta a un payaso demoníaco que acecha su pueblo.', 135, 2017, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/it.jpg', 'R'),
('A Quiet Place', 'Una familia sobrevive en un mundo donde criaturas cazan por el sonido.', 90, 2018, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/quiet.jpg', 'PG-13'),
('The Exorcist', 'Un sacerdote lucha contra una poderosa posesión demoníaca en una niña.', 132, 1973, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/exorcist.jpg', 'R');

-- Películas de Ciencia Ficción
INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url, age_rating) VALUES
('Blade Runner 2049', 'Un "blade runner" descubre un secreto que podría cambiar la sociedad para siempre.', 164, 2017, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/bladerunner.jpg', 'R'),
('Interstellar', 'Un grupo de astronautas busca un nuevo hogar para la humanidad más allá de las estrellas.', 169, 2014, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/interstellar.jpg', 'PG-13'),
('The Matrix', 'Un hacker descubre la verdad detrás de la realidad y lidera una rebelión contra las máquinas.', 136, 1999, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/matrix.jpg', 'R'),
('Arrival', 'Una lingüista trata de comunicarse con alienígenas para evitar un conflicto global.', 116, 2016, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/arrival.jpg', 'PG-13'),
('Inception', 'Un ladrón de sueños acepta una misión para plantar una idea en la mente de un magnate.', 148, 2010, 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', 'https://example.com/inception.jpg', 'PG-13');