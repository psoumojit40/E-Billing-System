<?php
/**
 * E-Billing System - Pure PHP & MySQL REST API Server
 * Compatible with PHP 8.1+, XAMPP, Apache, Nginx, TiDB Cloud, and Laravel 11 architecture.
 */

// 1. Enable Global CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Load Environment Variables / Defaults
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: 3306;
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
$dbName = getenv('DB_NAME') ?: 'invoice_generator_db';
$dbSsl  = getenv('DB_SSL') === 'true' || $dbPort == 4000 || str_contains($dbHost, 'tidbcloud.com');

$dataDir = __DIR__ . '/data';
$dbFile = $dataDir . '/database.json';

// Default Seed Data
$defaultProducts = [
    [
        'id' => 'prod-1',
        'sku' => 'PROD001',
        'name' => 'Product A',
        'description' => 'Premium product with enterprise level quality and SLA support',
        'price' => 500,
        'gstRate' => 18,
        'hsnCode' => '8471',
        'unit' => 'Pcs',
        'stock' => 120,
        'created_at' => date('c'),
    ],
    [
        'id' => 'prod-2',
        'sku' => 'PROD002',
        'name' => 'Product B',
        'description' => 'Standard product engineered for daily workflow and business reliability',
        'price' => 750,
        'gstRate' => 18,
        'hsnCode' => '8473',
        'unit' => 'Pcs',
        'stock' => 85,
        'created_at' => date('c'),
    ],
    [
        'id' => 'prod-3',
        'sku' => 'PROD003',
        'name' => 'Product C',
        'description' => 'Economy product providing cost-effective performance for general operations',
        'price' => 300,
        'gstRate' => 12,
        'hsnCode' => '8472',
        'unit' => 'Pcs',
        'stock' => 240,
        'created_at' => date('c'),
    ],
    [
        'id' => 'prod-4',
        'sku' => 'PROD004',
        'name' => 'Enterprise Cloud Suite',
        'description' => 'Annual multi-tier cloud management license and server backup utilities',
        'price' => 2400,
        'gstRate' => 18,
        'hsnCode' => '998313',
        'unit' => 'Lic',
        'stock' => 999,
        'created_at' => date('c'),
    ],
    [
        'id' => 'prod-5',
        'sku' => 'PROD005',
        'name' => 'Annual Maintenance Support (AMC)',
        'description' => '24/7 dedicated engineering support contract and quarterly hardware audits',
        'price' => 1200,
        'gstRate' => 18,
        'hsnCode' => '998717',
        'unit' => 'Yr',
        'stock' => 500,
        'created_at' => date('c'),
    ],
    [
        'id' => 'prod-6',
        'sku' => 'PROD006',
        'name' => 'Essential Peripheral Pack',
        'description' => 'Ergonomic high-precision peripherals bundle with braided cables',
        'price' => 450,
        'gstRate' => 5,
        'hsnCode' => '8528',
        'unit' => 'Set',
        'stock' => 60,
        'created_at' => date('c'),
    ],
];

$defaultCompanies = [
    [
        'id' => 'comp-1',
        'companyName' => 'Apex Enterprise Solutions Pvt. Ltd.',
        'tagline' => 'Enterprise Technology & Cloud Services',
        'companyAddress' => 'Plot 42, Tech Park Boulevard, Sector 5, Salt Lake, Kolkata, West Bengal 700091',
        'phone' => '+91 33 2948 1000',
        'email' => 'billing@apexenterprise.com',
        'gstNumber' => '19AAACA9876Q1Z2',
        'website' => 'https://apexenterprise.com',
        'companyLogo' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
        'created_at' => date('c'),
    ],
    [
        'id' => 'comp-2',
        'companyName' => 'Tech Minimal Systems & Cloud',
        'tagline' => 'Software Development & Infrastructure SLA',
        'companyAddress' => 'Suite 804, Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka 560103',
        'phone' => '+91 80 4122 9000',
        'email' => 'accounts@techminimal.io',
        'gstNumber' => '29AABCT5432K1Z9',
        'website' => 'https://techminimal.io',
        'companyLogo' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        'created_at' => date('c'),
    ],
    [
        'id' => 'comp-3',
        'companyName' => 'Blue Cyber Dynamics Ltd.',
        'tagline' => 'Cybersecurity & Data Center Managed Services',
        'companyAddress' => 'Tower B, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
        'phone' => '+91 22 6789 4000',
        'email' => 'finance@bluecyber.com',
        'gstNumber' => '27AAACB1234F1Z5',
        'website' => 'https://bluecyber.com',
        'companyLogo' => 'https://images.unsplash.com/photo-1614680376593-902f749f7bc9?w=200&auto=format&fit=crop&q=80',
        'created_at' => date('c'),
    ],
];

// 3. MySQL / PDO Connection Initialization
$pdo = null;
$isMysqlConnected = false;

try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    if ($dbSsl) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = true;
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }

    try {
        // Direct connect
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    } catch (PDOException $e) {
        // Create DB if missing on local server
        $rootDsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
        $rootPdo = new PDO($rootDsn, $dbUser, $dbPass, $options);
        $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    }

    // Auto-create Tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `products` (
            `id` VARCHAR(255) PRIMARY KEY,
            `sku` VARCHAR(50) NOT NULL UNIQUE,
            `name` VARCHAR(255) NOT NULL,
            `description` TEXT NULL,
            `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
            `gstRate` DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
            `hsnCode` VARCHAR(50) NULL,
            `unit` VARCHAR(20) DEFAULT 'Pcs',
            `stock` INT DEFAULT 100,
            `created_at` VARCHAR(100) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `invoices` (
            `id` VARCHAR(255) PRIMARY KEY,
            `invoiceNumber` VARCHAR(100) NOT NULL UNIQUE,
            `createdAt` VARCHAR(100) NOT NULL,
            `updatedAt` VARCHAR(100) NOT NULL,
            `company` JSON NOT NULL,
            `customer` JSON NOT NULL,
            `meta` JSON NOT NULL,
            `items` JSON NOT NULL,
            `summary` JSON NOT NULL,
            `status` VARCHAR(50) DEFAULT 'Draft'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `companies` (
            `id` VARCHAR(255) PRIMARY KEY,
            `companyName` VARCHAR(255) NOT NULL,
            `tagline` VARCHAR(255) NULL,
            `companyAddress` TEXT NOT NULL,
            `phone` VARCHAR(100) NOT NULL,
            `email` VARCHAR(150) NOT NULL,
            `gstNumber` VARCHAR(50) NOT NULL,
            `website` VARCHAR(255) NULL,
            `companyLogo` TEXT NULL,
            `created_at` VARCHAR(100) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Seed products if empty
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM `products`");
    $rowCount = (int)$stmt->fetchColumn();
    if ($rowCount === 0) {
        $insertProd = $pdo->prepare("INSERT INTO `products` (`id`, `sku`, `name`, `description`, `price`, `gstRate`, `hsnCode`, `unit`, `stock`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($defaultProducts as $p) {
            $insertProd->execute([$p['id'], $p['sku'], $p['name'], $p['description'], $p['price'], $p['gstRate'], $p['hsnCode'], $p['unit'], $p['stock'], $p['created_at']]);
        }
    }

    // Seed companies if empty
    foreach ($defaultCompanies as $c) {
        $insertComp = $pdo->prepare("INSERT INTO `companies` (`id`, `companyName`, `tagline`, `companyAddress`, `phone`, `email`, `gstNumber`, `website`, `companyLogo`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`)");
        $insertComp->execute([$c['id'], $c['companyName'], $c['tagline'], $c['companyAddress'], $c['phone'], $c['email'], $c['gstNumber'], $c['website'], $c['companyLogo'], $c['created_at']]);
    }

    $isMysqlConnected = true;
} catch (Exception $e) {
    $isMysqlConnected = false;
}

// 4. JSON Fallback Helpers
function getJsonDb() {
    global $dataDir, $dbFile, $defaultProducts, $defaultCompanies;
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0777, true);
    }
    if (!file_exists($dbFile)) {
        $initial = ['products' => $defaultProducts, 'invoices' => [], 'companies' => $defaultCompanies];
        file_put_contents($dbFile, json_encode($initial, JSON_PRETTY_PRINT));
        return $initial;
    }
    $content = file_get_contents($dbFile);
    $data = json_decode($content, true) ?: ['products' => $defaultProducts, 'invoices' => [], 'companies' => $defaultCompanies];
    if (empty($data['companies'])) {
        $data['companies'] = $defaultCompanies;
        file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));
    }
    return $data;
}

function saveJsonDb($data) {
    global $dbFile;
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));
}

// 5. Request Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: $_POST;

// Strip base prefix if running under subfolder
$uri = preg_replace('#^/api#', '', $uri);
if ($uri === '' || $uri === false) {
    $uri = '/';
}

// Health Check
if ($uri === '/health' || $uri === '/') {
    echo json_encode([
        'status' => 'ok',
        'service' => 'PHP 8.2 & Laravel Architecture REST API',
        'database' => $isMysqlConnected ? 'MySQL Connected' : 'JSON DB Fallback',
        'time' => date('c'),
    ]);
    exit();
}

// -------------------------------------------------------------
// PRODUCTS ENDPOINTS
// -------------------------------------------------------------
if ($uri === '/products') {
    if ($method === 'GET') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->query("SELECT * FROM `products` ORDER BY `sku` ASC");
            $prods = $stmt->fetchAll();
            foreach ($prods as &$p) {
                $p['price'] = (float)$p['price'];
                $p['gstRate'] = (float)$p['gstRate'];
                $p['stock'] = (int)$p['stock'];
            }
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $prods]);
            exit();
        }
        $db = getJsonDb();
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $db['products']]);
        exit();
    }

    if ($method === 'POST') {
        $name = trim($body['name'] ?? '');
        $price = isset($body['price']) ? (float)$body['price'] : 0.0;
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product name is required']);
            exit();
        }

        $id = $body['id'] ?? ('prod-' . time() . '-' . substr(md5(uniqid()), 0, 4));
        $sku = !empty($body['sku']) ? strtoupper(trim($body['sku'])) : ('PROD' . sprintf('%03d', rand(100, 999)));
        $desc = $body['description'] ?? '';
        $gstRate = isset($body['gstRate']) ? (float)$body['gstRate'] : 18.0;
        $hsn = $body['hsnCode'] ?? '';
        $unit = $body['unit'] ?? 'Pcs';
        $stock = isset($body['stock']) ? (int)$body['stock'] : 100;
        $createdAt = date('c');

        $newProduct = [
            'id' => $id,
            'sku' => $sku,
            'name' => $name,
            'description' => $desc,
            'price' => $price,
            'gstRate' => $gstRate,
            'hsnCode' => $hsn,
            'unit' => $unit,
            'stock' => $stock,
            'created_at' => $createdAt,
        ];

        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO `products` (`id`, `sku`, `name`, `description`, `price`, `gstRate`, `hsnCode`, `unit`, `stock`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`), `gstRate`=VALUES(`gstRate`)");
            $stmt->execute([$id, $sku, $name, $desc, $price, $gstRate, $hsn, $unit, $stock, $createdAt]);
            http_response_code(201);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $newProduct]);
            exit();
        }

        $db = getJsonDb();
        array_unshift($db['products'], $newProduct);
        saveJsonDb($db);
        http_response_code(201);
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $newProduct]);
        exit();
    }
}

// Single Product Route: PUT / DELETE
if (preg_match('#^/products/([^/]+)$#', $uri, $matches)) {
    $prodId = $matches[1];

    if ($method === 'PUT') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("UPDATE `products` SET `name`=?, `description`=?, `price`=?, `gstRate`=?, `hsnCode`=?, `unit`=?, `stock`=? WHERE `id`=?");
            $stmt->execute([
                $body['name'] ?? 'Product',
                $body['description'] ?? '',
                (float)($body['price'] ?? 0),
                (float)($body['gstRate'] ?? 18),
                $body['hsnCode'] ?? '',
                $body['unit'] ?? 'Pcs',
                (int)($body['stock'] ?? 100),
                $prodId
            ]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => array_merge(['id' => $prodId], $body)]);
            exit();
        }
        $db = getJsonDb();
        foreach ($db['products'] as &$p) {
            if ($p['id'] === $prodId) {
                $p = array_merge($p, $body);
                break;
            }
        }
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => array_merge(['id' => $prodId], $body)]);
        exit();
    }

    if ($method === 'DELETE') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM `products` WHERE `id` = ?");
            $stmt->execute([$prodId]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'message' => 'Product deleted']);
            exit();
        }
        $db = getJsonDb();
        $db['products'] = array_values(array_filter($db['products'], fn($p) => $p['id'] !== $prodId));
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'message' => 'Product deleted']);
        exit();
    }
}

// -------------------------------------------------------------
// INVOICES ENDPOINTS
// -------------------------------------------------------------
if ($uri === '/invoices') {
    if ($method === 'GET') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->query("SELECT * FROM `invoices` ORDER BY `createdAt` DESC");
            $invoices = $stmt->fetchAll();
            foreach ($invoices as &$inv) {
                $inv['company'] = json_decode($inv['company'], true);
                $inv['customer'] = json_decode($inv['customer'], true);
                $inv['meta'] = json_decode($inv['meta'], true);
                $inv['items'] = json_decode($inv['items'], true);
                $inv['summary'] = json_decode($inv['summary'], true);
            }
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $invoices]);
            exit();
        }
        $db = getJsonDb();
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $db['invoices']]);
        exit();
    }

    if ($method === 'POST') {
        $invNum = $body['invoiceNumber'] ?? $body['meta']['invoiceNumber'] ?? ('INV-' . date('Ym') . '-' . rand(1000, 9999));
        $id = $body['id'] ?? ('inv-' . time() . '-' . substr(md5(uniqid()), 0, 4));
        $createdAt = $body['createdAt'] ?? date('c');
        $updatedAt = date('c');
        $status = $body['status'] ?? 'Draft';

        $company = $body['company'] ?? [];
        $customer = $body['customer'] ?? [];
        $meta = $body['meta'] ?? [];
        $items = $body['items'] ?? [];
        $summary = $body['summary'] ?? [];

        $record = [
            'id' => $id,
            'invoiceNumber' => $invNum,
            'createdAt' => $createdAt,
            'updatedAt' => $updatedAt,
            'company' => $company,
            'customer' => $customer,
            'meta' => $meta,
            'items' => $items,
            'summary' => $summary,
            'status' => $status,
        ];

        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO `invoices` (`id`, `invoiceNumber`, `createdAt`, `updatedAt`, `company`, `customer`, `meta`, `items`, `summary`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `updatedAt`=VALUES(`updatedAt`), `status`=VALUES(`status`), `items`=VALUES(`items`), `summary`=VALUES(`summary`), `meta`=VALUES(`meta`)");
            $stmt->execute([
                $id,
                $invNum,
                $createdAt,
                $updatedAt,
                json_encode($company),
                json_encode($customer),
                json_encode($meta),
                json_encode($items),
                json_encode($summary),
                $status
            ]);
            http_response_code(201);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $record]);
            exit();
        }

        $db = getJsonDb();
        $filtered = array_values(array_filter($db['invoices'], fn($i) => ($i['invoiceNumber'] ?? '') !== $invNum && ($i['id'] ?? '') !== $id));
        array_unshift($filtered, $record);
        $db['invoices'] = $filtered;
        saveJsonDb($db);
        http_response_code(201);
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $record]);
        exit();
    }
}

// Single Invoice Route: PUT status, DELETE, SEND EMAIL
if (preg_match('#^/invoices/([^/]+)(?:/(send-email))?$#', $uri, $matches)) {
    $invId = $matches[1];
    $isSendEmail = isset($matches[2]) && $matches[2] === 'send-email';

    if ($isSendEmail && $method === 'POST') {
        $recipient = $body['recipientEmail'] ?? 'customer@example.com';
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("UPDATE `invoices` SET `status` = 'Sent', `updatedAt` = ? WHERE `id` = ? OR `invoiceNumber` = ?");
            $stmt->execute([date('c'), $invId, $invId]);
        }
        $db = getJsonDb();
        foreach ($db['invoices'] as &$inv) {
            if (($inv['id'] ?? '') === $invId || ($inv['invoiceNumber'] ?? '') === $invId) {
                $inv['status'] = 'Sent';
                $inv['updatedAt'] = date('c');
                break;
            }
        }
        saveJsonDb($db);
        echo json_encode(['success' => true, 'message' => "Invoice sent to {$recipient}"]);
        exit();
    }

    if ($method === 'PUT') {
        $newStatus = $body['status'] ?? 'Draft';
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("UPDATE `invoices` SET `status` = ?, `updatedAt` = ? WHERE `id` = ? OR `invoiceNumber` = ?");
            $stmt->execute([$newStatus, date('c'), $invId, $invId]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'message' => "Status updated to {$newStatus}"]);
            exit();
        }
        $db = getJsonDb();
        foreach ($db['invoices'] as &$inv) {
            if (($inv['id'] ?? '') === $invId || ($inv['invoiceNumber'] ?? '') === $invId) {
                $inv['status'] = $newStatus;
                $inv['updatedAt'] = date('c');
                break;
            }
        }
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'message' => "Status updated to {$newStatus}"]);
        exit();
    }

    if ($method === 'DELETE') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM `invoices` WHERE `id` = ? OR `invoiceNumber` = ?");
            $stmt->execute([$invId, $invId]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'message' => 'Invoice deleted']);
            exit();
        }
        $db = getJsonDb();
        $db['invoices'] = array_values(array_filter($db['invoices'], fn($i) => ($i['id'] ?? '') !== $invId && ($i['invoiceNumber'] ?? '') !== $invId));
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'message' => 'Invoice deleted']);
        exit();
    }
}

// -------------------------------------------------------------
// COMPANIES ENDPOINTS
// -------------------------------------------------------------
if ($uri === '/companies') {
    if ($method === 'GET') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->query("SELECT * FROM `companies` ORDER BY `companyName` ASC");
            $comps = $stmt->fetchAll();
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $comps]);
            exit();
        }
        $db = getJsonDb();
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $db['companies']]);
        exit();
    }

    if ($method === 'POST') {
        $id = $body['id'] ?? ('comp-' . time() . '-' . substr(md5(uniqid()), 0, 4));
        $name = $body['companyName'] ?? 'Organization';
        $tagline = $body['tagline'] ?? '';
        $addr = $body['companyAddress'] ?? '';
        $phone = $body['phone'] ?? '';
        $email = $body['email'] ?? '';
        $gst = $body['gstNumber'] ?? '';
        $website = $body['website'] ?? '';
        $logo = $body['companyLogo'] ?? '';
        $createdAt = date('c');

        $compRecord = [
            'id' => $id,
            'companyName' => $name,
            'tagline' => $tagline,
            'companyAddress' => $addr,
            'phone' => $phone,
            'email' => $email,
            'gstNumber' => $gst,
            'website' => $website,
            'companyLogo' => $logo,
            'created_at' => $createdAt,
        ];

        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("INSERT INTO `companies` (`id`, `companyName`, `tagline`, `companyAddress`, `phone`, `email`, `gstNumber`, `website`, `companyLogo`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `companyName`=VALUES(`companyName`), `companyAddress`=VALUES(`companyAddress`)");
            $stmt->execute([$id, $name, $tagline, $addr, $phone, $email, $gst, $website, $logo, $createdAt]);
            http_response_code(201);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => $compRecord]);
            exit();
        }

        $db = getJsonDb();
        array_unshift($db['companies'], $compRecord);
        saveJsonDb($db);
        http_response_code(201);
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => $compRecord]);
        exit();
    }
}

// Single Company Route: PUT / DELETE
if (preg_match('#^/companies/([^/]+)$#', $uri, $matches)) {
    $compId = $matches[1];

    if ($method === 'PUT') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("UPDATE `companies` SET `companyName`=?, `tagline`=?, `companyAddress`=?, `phone`=?, `email`=?, `gstNumber`=?, `website`=?, `companyLogo`=? WHERE `id`=?");
            $stmt->execute([
                $body['companyName'] ?? '',
                $body['tagline'] ?? '',
                $body['companyAddress'] ?? '',
                $body['phone'] ?? '',
                $body['email'] ?? '',
                $body['gstNumber'] ?? '',
                $body['website'] ?? '',
                $body['companyLogo'] ?? '',
                $compId
            ]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'data' => array_merge(['id' => $compId], $body)]);
            exit();
        }
        $db = getJsonDb();
        foreach ($db['companies'] as &$c) {
            if ($c['id'] === $compId) {
                $c = array_merge($c, $body);
                break;
            }
        }
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'data' => array_merge(['id' => $compId], $body)]);
        exit();
    }

    if ($method === 'DELETE') {
        if ($isMysqlConnected && $pdo) {
            $stmt = $pdo->prepare("DELETE FROM `companies` WHERE `id` = ?");
            $stmt->execute([$compId]);
            echo json_encode(['success' => true, 'database' => 'MySQL', 'message' => 'Company deleted']);
            exit();
        }
        $db = getJsonDb();
        $db['companies'] = array_values(array_filter($db['companies'], fn($c) => $c['id'] !== $compId));
        saveJsonDb($db);
        echo json_encode(['success' => true, 'database' => 'JSON', 'message' => 'Company deleted']);
        exit();
    }
}

// Stats Route
if ($uri === '/stats') {
    if ($isMysqlConnected && $pdo) {
        $invCount = (int)$pdo->query("SELECT COUNT(*) FROM `invoices`")->fetchColumn();
        $prodCount = (int)$pdo->query("SELECT COUNT(*) FROM `products`")->fetchColumn();
        $compCount = (int)$pdo->query("SELECT COUNT(*) FROM `companies`")->fetchColumn();
        echo json_encode(['success' => true, 'database' => 'MySQL', 'stats' => ['invoices' => $invCount, 'products' => $prodCount, 'companies' => $compCount]]);
        exit();
    }
    $db = getJsonDb();
    echo json_encode(['success' => true, 'database' => 'JSON', 'stats' => ['invoices' => count($db['invoices']), 'products' => count($db['products']), 'companies' => count($db['companies'])]]);
    exit();
}

// 404 Route
http_response_code(404);
echo json_encode(['success' => false, 'message' => 'Route not found: ' . $uri]);
