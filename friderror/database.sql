CREATE DATABASE car_app;

USE car_app;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(30),
  price DECIMAL(10, 2),
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$yourhashedpassword', 'admin'),
('user1', 'user1@example.com', '$2a$10$yourhashedpassword', 'user');

INSERT INTO cars (make, model, year, color, price, user_id) VALUES
('Toyota', 'Camry', 2020, 'Red', 25000.00, 1),
('Honda', 'Accord', 2019, 'Blue', 23000.00, 1),
('Ford', 'Mustang', 2021, 'Black', 35000.00, 2);