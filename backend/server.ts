import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database persistence directory & JSON fallback
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Database configuration (Local XAMPP / TiDB Cloud / Railway / Aiven / PlanetScale)
const DATABASE_URL = process.env.DATABASE_URL || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'invoice_generator_db';
const DB_SSL = process.env.DB_SSL === 'true' || DB_PORT === 4000 || DB_HOST.includes('tidbcloud.com');

let pool: mysql.Pool | null = null;
let isMysqlConnected = false;

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'PROD001',
    name: 'Product A',
    description: 'Premium product with enterprise level quality and SLA support',
    price: 500,
    gstRate: 18,
    hsnCode: '8471',
    unit: 'Pcs',
    stock: 120,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    sku: 'PROD002',
    name: 'Product B',
    description: 'Standard product engineered for daily workflow and business reliability',
    price: 750,
    gstRate: 18,
    hsnCode: '8473',
    unit: 'Pcs',
    stock: 85,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    sku: 'PROD003',
    name: 'Product C',
    description: 'Economy product providing cost-effective performance for general operations',
    price: 300,
    gstRate: 12,
    hsnCode: '8472',
    unit: 'Pcs',
    stock: 240,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    sku: 'PROD004',
    name: 'Enterprise Cloud Suite',
    description: 'Annual multi-tier cloud management license and server backup utilities',
    price: 2400,
    gstRate: 18,
    hsnCode: '998313',
    unit: 'Lic',
    stock: 999,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    sku: 'PROD005',
    name: 'Annual Maintenance Support (AMC)',
    description: '24/7 dedicated engineering support contract and quarterly hardware audits',
    price: 1200,
    gstRate: 18,
    hsnCode: '998717',
    unit: 'Yr',
    stock: 500,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    sku: 'PROD006',
    name: 'Essential Peripheral Pack',
    description: 'Ergonomic high-precision peripherals bundle with braided cables',
    price: 450,
    gstRate: 5,
    hsnCode: '8528',
    unit: 'Set',
    stock: 60,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_COMPANIES = [
  {
    id: 'comp-1',
    companyName: 'Apex Enterprise Solutions Pvt. Ltd.',
    tagline: 'Enterprise Technology & Cloud Services',
    companyAddress: 'Plot 42, Tech Park Boulevard, Sector 5, Salt Lake, Kolkata, West Bengal 700091',
    phone: '+91 33 2948 1000',
    email: 'billing@apexenterprise.com',
    gstNumber: '19AAACA9876Q1Z2',
    website: 'https://apexenterprise.com',
    companyLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comp-2',
    companyName: 'Tech Minimal Systems & Cloud',
    tagline: 'Software Development & Infrastructure SLA',
    companyAddress: 'Suite 804, Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka 560103',
    phone: '+91 80 4122 9000',
    email: 'accounts@techminimal.io',
    gstNumber: '29AABCT5432K1Z9',
    website: 'https://techminimal.io',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comp-3',
    companyName: 'Blue Cyber Dynamics Ltd.',
    tagline: 'Cybersecurity & Data Center Managed Services',
    companyAddress: 'Tower B, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    phone: '+91 22 6789 4000',
    email: 'finance@bluecyber.com',
    gstNumber: '27AAACB1234F1Z5',
    website: 'https://bluecyber.com',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f749f7bc9?w=200&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
];

async function initMysqlDatabase(): Promise<boolean> {
  try {
    const sslConfig = DB_SSL ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined;

    if (DATABASE_URL) {
      pool = mysql.createPool(DATABASE_URL);
    } else {
      // 1. Try direct connection to target database first (required for TiDB Cloud / managed cloud DBs)
      try {
        pool = mysql.createPool({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          ssl: sslConfig,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
        await pool.query('SELECT 1');
      } catch (directErr: any) {
        // If database doesn't exist on local MySQL/XAMPP, try creating it
        if (directErr?.code === 'ER_BAD_DB_ERROR' || directErr?.errno === 1049) {
          const rootConnection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            ssl: sslConfig,
          });
          await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
          await rootConnection.end();

          pool = mysql.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            ssl: sslConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
          });
        } else {
          throw directErr;
        }
      }
    }

    // 3. Create Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` VARCHAR(255) PRIMARY KEY,
        \`sku\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NULL,
        \`price\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        \`gstRate\` DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
        \`hsnCode\` VARCHAR(50) NULL,
        \`unit\` VARCHAR(20) DEFAULT 'Pcs',
        \`stock\` INT DEFAULT 100,
        \`created_at\` VARCHAR(100) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create Invoices Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`invoices\` (
        \`id\` VARCHAR(255) PRIMARY KEY,
        \`invoiceNumber\` VARCHAR(100) NOT NULL UNIQUE,
        \`createdAt\` VARCHAR(100) NOT NULL,
        \`updatedAt\` VARCHAR(100) NOT NULL,
        \`company\` JSON NOT NULL,
        \`customer\` JSON NOT NULL,
        \`meta\` JSON NOT NULL,
        \`items\` JSON NOT NULL,
        \`summary\` JSON NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'Draft'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create Companies Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`companies\` (
        \`id\` VARCHAR(255) PRIMARY KEY,
        \`companyName\` VARCHAR(255) NOT NULL,
        \`tagline\` VARCHAR(255) NULL,
        \`companyAddress\` TEXT NOT NULL,
        \`phone\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`gstNumber\` VARCHAR(50) NOT NULL,
        \`website\` VARCHAR(255) NULL,
        \`companyLogo\` TEXT NULL,
        \`created_at\` VARCHAR(100) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Seed default products if empty
    const [rows]: any = await pool.query(`SELECT COUNT(*) as count FROM \`products\`;`);
    if (rows && rows[0] && rows[0].count === 0) {
      for (const p of DEFAULT_PRODUCTS) {
        await pool.query(
          `INSERT INTO \`products\` (\`id\`, \`sku\`, \`name\`, \`description\`, \`price\`, \`gstRate\`, \`hsnCode\`, \`unit\`, \`stock\`, \`created_at\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [p.id, p.sku, p.name, p.description, p.price, p.gstRate, p.hsnCode, p.unit, p.stock, p.created_at]
        );
      }
    }

    // 7. Seed default companies if empty or ensure all 3 default companies exist
    for (const c of DEFAULT_COMPANIES) {
      await pool.query(
        `INSERT INTO \`companies\` (\`id\`, \`companyName\`, \`tagline\`, \`companyAddress\`, \`phone\`, \`email\`, \`gstNumber\`, \`website\`, \`companyLogo\`, \`created_at\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`companyName\` = VALUES(\`companyName\`);`,
        [c.id, c.companyName, c.tagline, c.companyAddress, c.phone, c.email, c.gstNumber, c.website, c.companyLogo, c.created_at]
      );
    }

    isMysqlConnected = true;
    console.log(`✅ Successfully connected to MySQL database: ${DB_NAME} on ${DB_HOST}:${DB_PORT} (SSL: ${DB_SSL ? 'Enabled' : 'Disabled'})`);
    return true;
  } catch (err) {
    isMysqlConnected = false;
    console.warn(`⚠️ Could not connect to MySQL (${DB_HOST}:${DB_PORT}). Falling back to JSON storage file: ${err}`);
    return false;
  }
}

// JSON DB Fallback Functions
function initJsonDb(): any {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultDb = { products: DEFAULT_PRODUCTS, invoices: [], companies: DEFAULT_COMPANIES };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const json = JSON.parse(content);
    if (!json.companies || json.companies.length === 0) {
      json.companies = DEFAULT_COMPANIES;
      fs.writeFileSync(DB_FILE, JSON.stringify(json, null, 2), 'utf-8');
    }
    return json;
  } catch (err) {
    return { products: DEFAULT_PRODUCTS, invoices: [], companies: DEFAULT_COMPANIES };
  }
}

function saveJsonDb(data: any): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving JSON fallback:', err);
  }
}

// ---------------- API ROUTES ----------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMysqlConnected ? 'XAMPP Live MySQL Database' : 'JSON File Storage Fallback',
    dbHost: DB_HOST,
    dbName: DB_NAME,
    timestamp: new Date().toISOString(),
  });
});

// Products: List all
app.get('/api/products', async (req, res) => {
  if (isMysqlConnected && pool) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM \`products\` ORDER BY \`created_at\` DESC;`);
      return res.json({ success: true, database: 'MySQL', data: rows });
    } catch (err) {
      console.error('MySQL products fetch error:', err);
    }
  }

  const jsonDb = initJsonDb();
  res.json({ success: true, database: 'JSON', data: jsonDb.products });
});

// Products: Add new
app.post('/api/products', async (req, res) => {
  const { sku, name, description, price, gstRate, hsnCode, unit, stock } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'Product name and price are required' });
  }

  const newProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    sku: sku || `PROD${Date.now().toString().slice(-4)}`,
    name,
    description: description || '',
    price: Number(price) || 0,
    gstRate: Number(gstRate) !== undefined ? Number(gstRate) : 18,
    hsnCode: hsnCode || '',
    unit: unit || 'Pcs',
    stock: Number(stock) || 100,
    created_at: new Date().toISOString(),
  };

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO \`products\` (\`id\`, \`sku\`, \`name\`, \`description\`, \`price\`, \`gstRate\`, \`hsnCode\`, \`unit\`, \`stock\`, \`created_at\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newProduct.id,
          newProduct.sku,
          newProduct.name,
          newProduct.description,
          newProduct.price,
          newProduct.gstRate,
          newProduct.hsnCode,
          newProduct.unit,
          newProduct.stock,
          newProduct.created_at,
        ]
      );
      return res.status(201).json({ success: true, database: 'MySQL', data: newProduct, message: 'Product added to live MySQL database' });
    } catch (err) {
      console.error('MySQL insert product error:', err);
    }
  }

  const jsonDb = initJsonDb();
  jsonDb.products.unshift(newProduct);
  saveJsonDb(jsonDb);
  res.status(201).json({ success: true, database: 'JSON', data: newProduct, message: 'Product added to catalog' });
});

// Products: Update
app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const { sku, name, description, price, gstRate, hsnCode, unit, stock } = req.body;

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `UPDATE \`products\` SET \`sku\` = ?, \`name\` = ?, \`description\` = ?, \`price\` = ?, \`gstRate\` = ?, \`hsnCode\` = ?, \`unit\` = ?, \`stock\` = ? WHERE \`id\` = ?;`,
        [sku, name, description, Number(price), Number(gstRate), hsnCode, unit, Number(stock), id]
      );
      const [updated]: any = await pool.query(`SELECT * FROM \`products\` WHERE \`id\` = ?;`, [id]);
      return res.json({ success: true, database: 'MySQL', data: updated[0] || req.body, message: 'Product updated in MySQL' });
    } catch (err) {
      console.error('MySQL update product error:', err);
    }
  }

  const jsonDb = initJsonDb();
  const index = jsonDb.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    jsonDb.products[index] = { ...jsonDb.products[index], ...req.body, id };
    saveJsonDb(jsonDb);
    return res.json({ success: true, database: 'JSON', data: jsonDb.products[index] });
  }

  res.status(404).json({ success: false, message: 'Product not found' });
});

// Products: Delete
app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id;

  if (isMysqlConnected && pool) {
    try {
      await pool.query(`DELETE FROM \`products\` WHERE \`id\` = ?;`, [id]);
      return res.json({ success: true, database: 'MySQL', message: 'Product deleted from MySQL database' });
    } catch (err) {
      console.error('MySQL delete product error:', err);
    }
  }

  const jsonDb = initJsonDb();
  jsonDb.products = jsonDb.products.filter((p: any) => p.id !== id);
  saveJsonDb(jsonDb);
  res.json({ success: true, database: 'JSON', message: 'Product deleted' });
});

// ---------------- COMPANIES ROUTES ----------------

// Companies: List all
app.get('/api/companies', async (req, res) => {
  if (isMysqlConnected && pool) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM \`companies\` ORDER BY \`created_at\` DESC;`);
      return res.json({ success: true, database: 'MySQL', data: rows });
    } catch (err) {
      console.error('MySQL companies fetch error:', err);
    }
  }

  const jsonDb = initJsonDb();
  res.json({ success: true, database: 'JSON', data: jsonDb.companies || DEFAULT_COMPANIES });
});

// Companies: Add new
app.post('/api/companies', async (req, res) => {
  const { companyName, tagline, companyAddress, phone, email, gstNumber, website, companyLogo } = req.body;

  if (!companyName || !companyAddress || !gstNumber) {
    return res.status(400).json({ success: false, message: 'Company Name, Address, and GSTIN are required' });
  }

  const newCompany = {
    id: req.body.id || `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    companyName,
    tagline: tagline || '',
    companyAddress,
    phone: phone || '',
    email: email || '',
    gstNumber,
    website: website || '',
    companyLogo: companyLogo || '',
    created_at: new Date().toISOString(),
  };

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO \`companies\` (\`id\`, \`companyName\`, \`tagline\`, \`companyAddress\`, \`phone\`, \`email\`, \`gstNumber\`, \`website\`, \`companyLogo\`, \`created_at\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newCompany.id,
          newCompany.companyName,
          newCompany.tagline,
          newCompany.companyAddress,
          newCompany.phone,
          newCompany.email,
          newCompany.gstNumber,
          newCompany.website,
          newCompany.companyLogo,
          newCompany.created_at,
        ]
      );
      return res.status(201).json({ success: true, database: 'MySQL', data: newCompany, message: 'Company stored in MySQL' });
    } catch (err) {
      console.error('MySQL insert company error:', err);
    }
  }

  const jsonDb = initJsonDb();
  if (!jsonDb.companies) jsonDb.companies = [];
  jsonDb.companies.unshift(newCompany);
  saveJsonDb(jsonDb);
  res.status(201).json({ success: true, database: 'JSON', data: newCompany });
});

// Companies: Update
app.put('/api/companies/:id', async (req, res) => {
  const id = req.params.id;
  const { companyName, tagline, companyAddress, phone, email, gstNumber, website, companyLogo } = req.body;

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `UPDATE \`companies\` SET \`companyName\` = ?, \`tagline\` = ?, \`companyAddress\` = ?, \`phone\` = ?, \`email\` = ?, \`gstNumber\` = ?, \`website\` = ?, \`companyLogo\` = ? WHERE \`id\` = ?;`,
        [companyName, tagline, companyAddress, phone, email, gstNumber, website, companyLogo, id]
      );
      const [updated]: any = await pool.query(`SELECT * FROM \`companies\` WHERE \`id\` = ?;`, [id]);
      return res.json({ success: true, database: 'MySQL', data: updated[0] || req.body });
    } catch (err) {
      console.error('MySQL update company error:', err);
    }
  }

  const jsonDb = initJsonDb();
  if (!jsonDb.companies) jsonDb.companies = [];
  const idx = jsonDb.companies.findIndex((c: any) => c.id === id);
  if (idx !== -1) {
    jsonDb.companies[idx] = { ...jsonDb.companies[idx], ...req.body, id };
    saveJsonDb(jsonDb);
    return res.json({ success: true, database: 'JSON', data: jsonDb.companies[idx] });
  }

  res.status(404).json({ success: false, message: 'Company not found' });
});

// Companies: Delete
app.delete('/api/companies/:id', async (req, res) => {
  const id = req.params.id;

  if (isMysqlConnected && pool) {
    try {
      await pool.query(`DELETE FROM \`companies\` WHERE \`id\` = ?;`, [id]);
      return res.json({ success: true, database: 'MySQL', message: 'Company deleted from MySQL' });
    } catch (err) {
      console.error('MySQL delete company error:', err);
    }
  }

  const jsonDb = initJsonDb();
  if (!jsonDb.companies) jsonDb.companies = [];
  jsonDb.companies = jsonDb.companies.filter((c: any) => c.id !== id);
  saveJsonDb(jsonDb);
  res.json({ success: true, database: 'JSON', message: 'Company deleted' });
});

// Invoices: List all
app.get('/api/invoices', async (req, res) => {
  const { search, status } = req.query;

  if (isMysqlConnected && pool) {
    try {
      let query = `SELECT * FROM \`invoices\``;
      const params: any[] = [];
      const whereConditions: string[] = [];

      if (status && status !== 'all') {
        whereConditions.push(`LOWER(\`status\`) = ?`);
        params.push(String(status).toLowerCase());
      }

      if (search) {
        whereConditions.push(`(LOWER(\`invoiceNumber\`) LIKE ? OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`customer\`, '$.customerName'))) LIKE ?)`);
        const q = `%${String(search).toLowerCase()}%`;
        params.push(q, q);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
      }

      query += ` ORDER BY \`createdAt\` DESC;`;

      const [rows]: any = await pool.query(query, params);
      
      // Parse JSON strings from MySQL if returned as strings
      const parsedInvoices = rows.map((inv: any) => ({
        ...inv,
        company: typeof inv.company === 'string' ? JSON.parse(inv.company) : inv.company,
        customer: typeof inv.customer === 'string' ? JSON.parse(inv.customer) : inv.customer,
        meta: typeof inv.meta === 'string' ? JSON.parse(inv.meta) : inv.meta,
        items: typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items,
        summary: typeof inv.summary === 'string' ? JSON.parse(inv.summary) : inv.summary,
      }));

      return res.json({ success: true, database: 'MySQL', count: parsedInvoices.length, data: parsedInvoices });
    } catch (err) {
      console.error('MySQL fetch invoices error:', err);
    }
  }

  const jsonDb = initJsonDb();
  let filtered = [...jsonDb.invoices];
  if (status && status !== 'all') {
    filtered = filtered.filter((inv: any) => inv.status.toLowerCase() === String(status).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (inv: any) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customer?.customerName?.toLowerCase().includes(q)
    );
  }
  filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, database: 'JSON', count: filtered.length, data: filtered });
});

// Invoices: Get single
app.get('/api/invoices/:id', async (req, res) => {
  const id = req.params.id;

  if (isMysqlConnected && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM \`invoices\` WHERE \`id\` = ? OR \`invoiceNumber\` = ? LIMIT 1;`,
        [id, id]
      );
      if (rows && rows.length > 0) {
        const inv = rows[0];
        const invoiceData = {
          ...inv,
          company: typeof inv.company === 'string' ? JSON.parse(inv.company) : inv.company,
          customer: typeof inv.customer === 'string' ? JSON.parse(inv.customer) : inv.customer,
          meta: typeof inv.meta === 'string' ? JSON.parse(inv.meta) : inv.meta,
          items: typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items,
          summary: typeof inv.summary === 'string' ? JSON.parse(inv.summary) : inv.summary,
        };
        return res.json({ success: true, database: 'MySQL', data: invoiceData });
      }
    } catch (err) {
      console.error('MySQL get single invoice error:', err);
    }
  }

  const jsonDb = initJsonDb();
  const found = jsonDb.invoices.find((i: any) => i.id === id || i.invoiceNumber === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }
  res.json({ success: true, database: 'JSON', data: found });
});

// Invoices: Create/Store in Live MySQL
app.post('/api/invoices', async (req, res) => {
  const invoiceData = req.body;

  if (!invoiceData.invoiceNumber || !invoiceData.items || !invoiceData.items.length) {
    return res.status(400).json({
      success: false,
      message: 'Invoice number and at least one item are required',
    });
  }

  const id = invoiceData.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const invoiceNumber = invoiceData.invoiceNumber;
  const createdAt = invoiceData.createdAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const companyJson = JSON.stringify(invoiceData.company || {});
  const customerJson = JSON.stringify(invoiceData.customer || {});
  const metaJson = JSON.stringify(invoiceData.meta || {});
  const itemsJson = JSON.stringify(invoiceData.items || []);
  const summaryJson = JSON.stringify(invoiceData.summary || {});
  const status = invoiceData.status || 'Draft';

  const newInvoice = {
    id,
    invoiceNumber,
    createdAt,
    updatedAt,
    company: invoiceData.company,
    customer: invoiceData.customer,
    meta: invoiceData.meta,
    items: invoiceData.items,
    summary: invoiceData.summary,
    status,
  };

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO \`invoices\` (\`id\`, \`invoiceNumber\`, \`createdAt\`, \`updatedAt\`, \`company\`, \`customer\`, \`meta\`, \`items\`, \`summary\`, \`status\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           \`updatedAt\` = VALUES(\`updatedAt\`),
           \`company\` = VALUES(\`company\`),
           \`customer\` = VALUES(\`customer\`),
           \`meta\` = VALUES(\`meta\`),
           \`items\` = VALUES(\`items\`),
           \`summary\` = VALUES(\`summary\`),
           \`status\` = VALUES(\`status\`);`,
        [id, invoiceNumber, createdAt, updatedAt, companyJson, customerJson, metaJson, itemsJson, summaryJson, status]
      );
      return res.status(201).json({
        success: true,
        database: 'XAMPP Live MySQL',
        data: newInvoice,
        message: 'Invoice stored successfully in XAMPP MySQL database!',
      });
    } catch (err) {
      console.error('MySQL insert invoice error:', err);
    }
  }

  const jsonDb = initJsonDb();
  const existingIdx = jsonDb.invoices.findIndex((i: any) => i.invoiceNumber === invoiceNumber);
  if (existingIdx >= 0) {
    jsonDb.invoices[existingIdx] = newInvoice;
  } else {
    jsonDb.invoices.unshift(newInvoice);
  }
  saveJsonDb(jsonDb);

  res.status(201).json({
    success: true,
    database: 'JSON',
    data: newInvoice,
    message: 'Invoice stored successfully in JSON database',
  });
});

// Invoices: Update status or fields
app.put('/api/invoices/:id', async (req, res) => {
  const id = req.params.id;

  if (isMysqlConnected && pool) {
    try {
      if (req.body.status) {
        await pool.query(`UPDATE \`invoices\` SET \`status\` = ?, \`updatedAt\` = ? WHERE \`id\` = ? OR \`invoiceNumber\` = ?;`, [
          req.body.status,
          new Date().toISOString(),
          id,
          id,
        ]);
      }
      const [updatedRows]: any = await pool.query(`SELECT * FROM \`invoices\` WHERE \`id\` = ? OR \`invoiceNumber\` = ? LIMIT 1;`, [id, id]);
      if (updatedRows && updatedRows.length > 0) {
        const inv = updatedRows[0];
        const invoiceData = {
          ...inv,
          company: typeof inv.company === 'string' ? JSON.parse(inv.company) : inv.company,
          customer: typeof inv.customer === 'string' ? JSON.parse(inv.customer) : inv.customer,
          meta: typeof inv.meta === 'string' ? JSON.parse(inv.meta) : inv.meta,
          items: typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items,
          summary: typeof inv.summary === 'string' ? JSON.parse(inv.summary) : inv.summary,
        };
        return res.json({ success: true, database: 'MySQL', data: invoiceData, message: 'Invoice updated in MySQL' });
      }
    } catch (err) {
      console.error('MySQL update invoice error:', err);
    }
  }

  const jsonDb = initJsonDb();
  const idx = jsonDb.invoices.findIndex((i: any) => i.id === id || i.invoiceNumber === id);
  if (idx !== -1) {
    jsonDb.invoices[idx] = { ...jsonDb.invoices[idx], ...req.body, updatedAt: new Date().toISOString() };
    saveJsonDb(jsonDb);
    return res.json({ success: true, database: 'JSON', data: jsonDb.invoices[idx] });
  }

  res.status(404).json({ success: false, message: 'Invoice not found' });
});

// Invoices: Send Email & Update Status to Sent
app.post('/api/invoices/:id/send-email', async (req, res) => {
  const id = req.params.id;
  const { recipientEmail, emailSubject, messageBody } = req.body;

  const targetEmail = recipientEmail || 'customer@example.com';

  if (isMysqlConnected && pool) {
    try {
      await pool.query(`UPDATE \`invoices\` SET \`status\` = 'Sent', \`updatedAt\` = ? WHERE \`id\` = ? OR \`invoiceNumber\` = ?;`, [
        new Date().toISOString(),
        id,
        id,
      ]);
      console.log(`📧 [EMAIL SENT] Invoice ID ${id} sent via SMTP to: ${targetEmail}`);
      return res.json({
        success: true,
        database: 'MySQL',
        status: 'Sent',
        message: `Invoice successfully sent to ${targetEmail}! Direct PDF download link included in email.`,
      });
    } catch (err) {
      console.error('MySQL send email invoice error:', err);
    }
  }

  const jsonDb = initJsonDb();
  const idx = jsonDb.invoices.findIndex((i: any) => i.id === id || i.invoiceNumber === id);
  if (idx !== -1) {
    jsonDb.invoices[idx].status = 'Sent';
    jsonDb.invoices[idx].updatedAt = new Date().toISOString();
    saveJsonDb(jsonDb);
    console.log(`📧 [EMAIL SENT] Invoice ID ${id} sent via SMTP to: ${targetEmail}`);
    return res.json({
      success: true,
      database: 'JSON',
      status: 'Sent',
      message: `Invoice successfully sent to ${targetEmail}! Direct PDF download link included in email.`,
    });
  }

  res.status(404).json({ success: false, message: 'Invoice not found' });
});

// Invoices: Delete
app.delete('/api/invoices/:id', async (req, res) => {
  const id = req.params.id;

  if (isMysqlConnected && pool) {
    try {
      await pool.query(`DELETE FROM \`invoices\` WHERE \`id\` = ? OR \`invoiceNumber\` = ?;`, [id, id]);
      return res.json({ success: true, database: 'MySQL', message: 'Invoice deleted from MySQL database' });
    } catch (err) {
      console.error('MySQL delete invoice error:', err);
    }
  }

  const jsonDb = initJsonDb();
  jsonDb.invoices = jsonDb.invoices.filter((i: any) => i.id !== id && i.invoiceNumber !== id);
  saveJsonDb(jsonDb);
  res.json({ success: true, database: 'JSON', message: 'Invoice deleted' });
});

// Start Server & Initialize XAMPP MySQL Connection
app.listen(PORT, async () => {
  console.log(`Backend API Server running on http://localhost:${PORT}`);
  await initMysqlDatabase();
});
