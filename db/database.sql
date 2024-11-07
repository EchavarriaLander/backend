CREATE DATABASE IF NOT EXISTS pelisdb;

USE pelisdb;

CREATE TABLE employee(
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) DEFAULT NULL, 
    salary INT(5) DEFAULT NULL,
    PRIMARY KEY (id)
);

DESCRIBE employee;

INSERT INTO employee VALUES
(1, 'John', 1000),
(2, 'Mary', 2000),
(3, 'Tom', 3000),
(4, 'Peter', 4000);