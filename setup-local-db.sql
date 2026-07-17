-- Run this once in MySQL Workbench or: mysql -u root -p < setup-local-db.sql

CREATE DATABASE IF NOT EXISTS devboard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'devboard'@'localhost' IDENTIFIED BY 'devboard';
GRANT ALL PRIVILEGES ON devboard.* TO 'devboard'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database ready!' AS status;
