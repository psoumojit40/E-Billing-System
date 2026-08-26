-- MySQL Database Schema for Product Invoice Generator

CREATE DATABASE IF NOT EXISTS `invoice_generator_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `invoice_generator_db`;

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS `companies` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `gst_number` VARCHAR(30) NOT NULL,
  `website` VARCHAR(255) NULL,
  `logo_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `billing_address` TEXT NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `gst_number` VARCHAR(30) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table (Pre-configured catalog)
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
  `hsn_code` VARCHAR(50) NULL,
  `unit` VARCHAR(20) DEFAULT 'Pcs',
  `stock` INT DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Initial Seed Data
INSERT INTO `products` (`sku`, `name`, `description`, `price`, `gst_rate`) VALUES
('PROD001', 'Product A', 'Premium product', 500.00, 18.00),
('PROD002', 'Product B', 'Standard product', 750.00, 18.00),
('PROD003', 'Product C', 'Economy product', 300.00, 12.00)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
  `company_id` BIGINT UNSIGNED NULL,
  `customer_id` BIGINT UNSIGNED NULL,
  `invoice_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `payment_terms` VARCHAR(100) DEFAULT 'Net 30',
  `status` ENUM('Draft', 'Sent', 'Paid', 'Pending', 'Overdue') DEFAULT 'Draft',
  `currency` VARCHAR(10) DEFAULT 'INR',
  `subtotal` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `discount_type` ENUM('percent', 'fixed') DEFAULT 'percent',
  `discount_value` DECIMAL(10, 2) DEFAULT 0.00,
  `discount_amount` DECIMAL(14, 2) DEFAULT 0.00,
  `taxable_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `total_tax` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `cgst_amount` DECIMAL(14, 2) DEFAULT 0.00,
  `sgst_amount` DECIMAL(14, 2) DEFAULT 0.00,
  `igst_amount` DECIMAL(14, 2) DEFAULT 0.00,
  `round_off` DECIMAL(6, 2) DEFAULT 0.00,
  `grand_total` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `terms_and_conditions` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_invoice_number` (`invoice_number`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB;

-- 5. Invoice Items Table
CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NULL,
  `sku` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `discount_percent` DECIMAL(5, 2) DEFAULT 0.00,
  `taxable_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `gst_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
