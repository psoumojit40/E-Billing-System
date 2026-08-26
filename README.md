# 🧾 E-Billing System - Enterprise Product Invoice Generator

A modern, full-featured GST billing, inventory management, and tax invoice generation platform built with a decoupled architecture (**React 19 + TypeScript + Tailwind CSS** frontend and **Node.js/Express + MySQL / Laravel** REST API backend).

Designed for enterprises, SMEs, freelancers, and merchants to generate statutory A4 tax invoices, manage multi-company profiles, maintain product catalogs, and export high-resolution PDFs.

---

## 🌟 Features Overview

### ⚡ 1. Intelligent Invoice Builder
* **Dynamic Line Items**: Add, edit, or delete items on the fly with real-time computations.
* **Catalog Autocomplete**: Select pre-configured products from inventory with instant auto-fill of SKU, description, unit price, HSN code, and GST rate.
* **Dual Discount Engine**: Apply individual percentage discounts per line item or a global discount (percentage or flat amount) across the invoice.
* **Auto Due-Date Computation**: Calculates payment due dates dynamically based on standard terms (*Due on Receipt*, *Net 15*, *Net 30*, *Net 45*, *Net 60*, or *Custom*).
* **Indian Currency Formatting & Words**: Accurate Indian Rupee standard format (`₹ 1,50,000.00`) and automatic currency-to-words conversion (*"INR One Lakh Fifty Thousand Only"*).

### 🏛️ 2. Statutory GST Tax Engine
* **Intra-State vs. Inter-State**: One-click toggle between Intra-State (**CGST + SGST**) and Inter-State (**IGST**) tax rules.
* **Multi-Tier GST Brackets**: Full support for statutory tax slabs (**0% Exempt**, **5% Essential**, **12% Standard Low**, **18% Standard Enterprise**, and **28% Luxury/Premium**).
* **Tax Breakdown Summary**: Clear tax ledger displaying taxable value, total taxes, and mathematical round-off adjustments.

### 📄 3. Pixel-Perfect A4 PDF & Native Print
* **High-Resolution Vector/Canvas PDF**: Generates pristine, print-ready A4 PDF documents with custom typography and crisp logos via `html2canvas` and `jsPDF`.
* **Isolated Native Print Engine**: Triggers clean hardware print workflows via hidden sandboxed iframes without browser UI clutter.
* **Universal Paper Isolation**: Printable invoices remain pure white with sharp black typography in both Light and Dark modes.

### 🏢 4. Multi-Company Seller Profiles Registry
* **Multiple Organization Support**: Save and manage multiple seller entities with distinct branding, GSTINs, addresses, and banking details.
* **Instant Active Seller Switching**: Apply any saved organization profile to the active invoice with a single click.
* **Logo Uploader**: Upload and store high-resolution brand logos.

### 📦 5. Live Product Inventory Catalog
* **Product Catalog Modal**: Create, update, search, and delete inventory items.
* **Stock & SKU Tracking**: Track stock quantities, Units of Measure (*Pcs, Units, Lic, Hrs, Sets, Yr*), and statutory HSN/SAC codes.
* **Pre-seeded Defaults**: Comes pre-populated with default products (Product A, Product B, Product C, Enterprise Cloud Suite, AMC, etc.).

### 💾 6. Invoice Database & Audit Trail
* **Saved Invoices Workspace**: Filter invoices by status (*All, Draft, Sent, Paid, Pending, Overdue*) or search by customer name, invoice number, or amount.
* **Security & Tamper-Proof Lock**: Paid invoices are strictly locked against malicious edits; only preview and PDF export are permitted.
* **Instant Status Updates**: Update invoice lifecycle stages seamlessly.

### 🌙 7. Global 5-Shade Monochrome Dark Theme
* **Modern Aesthetic**: Dark mode featuring deep charcoal canvas backgrounds (`#0D0D0D`), elevated cards (`#181818`), and refined borders (`#2C2C2C`).
* **Top-Right Quick Toggle**: Toggle between Dark and Light mode instantly from the top-right header with automatic `localStorage` persistence.
* **Off-White Sidebar**: Light mode features a clean off-white alabaster sidebar (`#F4F6F9`) with elevated navigation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion |
| **Build & Tooling** | Vite 6, PostCSS, Autoprefixer |
| **PDF & Print Engine** | jsPDF, html2canvas, Native Print Sandbox |
| **Backend REST API** | Node.js, Express, TypeScript, tsx, CORS |
| **Database Support** | MySQL 8.x / MariaDB (XAMPP compatible) + Zero-config JSON fallback |
| **Enterprise Suite** | Laravel 11 Controllers, MySQL DDL Migration Schema (`schema.sql`) |

---

## 📁 Repository Structure

```
product-invoice-generator/
├── frontend/                     # React 19 + TypeScript UI Project
│   ├── src/
│   │   ├── components/           # Modular UI Components
│   │   │   ├── CompanyDetailsForm.tsx     # Seller company parameters & logo
│   │   │   ├── CompanyManagerModal.tsx    # Multi-company registry
│   │   │   ├── CustomerDetailsForm.tsx    # Recipient & shipping details
│   │   │   ├── InvoiceMetaForm.tsx        # Numbering, date, currency, terms
│   │   │   ├── InvoicePreviewModal.tsx    # A4 printable canvas & PDF export
│   │   │   ├── InvoiceSummarySection.tsx  # Bank info, notes & tax computation
│   │   │   ├── ProductCatalogModal.tsx    # Inventory catalog manager
│   │   │   ├── ProductSelectorTable.tsx   # Line items table & price calculator
│   │   │   ├── SavedInvoicesList.tsx      # Invoices database & audit cards
│   │   │   └── Sidebar.tsx                # Standalone navigation panel
│   │   ├── data/
│   │   │   └── defaultData.ts             # Initial companies, products & terms
│   │   ├── utils/
│   │   │   ├── calculations.ts            # Tax math, currency & words engine
│   │   │   └── pdfGenerator.ts            # jsPDF & html2canvas export pipeline
│   │   ├── types.ts                       # Universal TypeScript data contracts
│   │   ├── index.css                      # Tailwind CSS v4 custom tokens & print styles
│   │   ├── main.tsx                       # React application entry point
│   │   └── App.tsx                        # Root layout, theme & state controller
│   ├── index.html                         # Vite HTML template
│   ├── vite.config.ts                     # Dev server with /api proxy to port 5000
│   ├── tsconfig.json                      # Frontend TypeScript compiler config
│   └── package.json                       # Frontend dependencies
│
├── backend/                      # Standalone Express REST API Backend
│   ├── data/
│   │   └── database.json                  # Local JSON persistence store
│   ├── laravel-api/                       # Laravel 11 & MySQL Enterprise Suite
│   │   ├── schema.sql                     # Full MySQL DDL Schema script
│   │   ├── app/Controllers/               # Laravel InvoiceController & ProductController
│   │   └── routes/api.php                 # Laravel REST API routes definition
│   ├── server.ts                          # Express API Server (port 5000)
│   ├── tsconfig.json                      # Backend TypeScript compiler config
│   └── package.json                       # Backend dependencies
│
├── package.json                  # Root orchestrator scripts (dev, build, start)
└── README.md                     # Documentation & Setup Guide
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
* **npm**: `v9.0.0` or higher
* *(Optional for MySQL Mode)* **XAMPP** or **MySQL Server** (port 3306)

---

### Method 1: Quick Start (Recommended)

You can launch both the **Backend API** and **Frontend UI** simultaneously from the project root.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/product-invoice-generator.git
   cd product-invoice-generator
   ```

2. **Install all dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install && cd ..

   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173`)
   - **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

### Method 2: Running Frontend & Backend in Separate Terminals

#### Terminal 1 — Start the Backend API:
```bash
cd backend
npm install
npm run dev
```
> The API server will start on `http://localhost:5000`. It automatically connects to MySQL if available, or falls back seamlessly to `backend/data/database.json`.

#### Terminal 2 — Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```
> The Vite dev server will start on `http://localhost:3000`. All `/api/*` network requests are automatically proxied to `http://localhost:5000`.

---

## 🗄️ Database Configuration & MySQL Setup

The backend features an **automatic dual-engine persistence layer**:
1. **MySQL Mode**: If MySQL is running on port `3306`, it connects automatically and creates all required tables.
2. **JSON Mode (Zero-Config Fallback)**: If MySQL is not detected, it persists data to `backend/data/database.json` without failing.

### Configuring MySQL (e.g., with XAMPP)

1. Start **Apache** and **MySQL** in your XAMPP Control Panel.
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or MySQL CLI.
3. Create a database:
   ```sql
   CREATE DATABASE invoice_generator_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Import the schema script:
   ```bash
   # Using MySQL CLI:
   mysql -u root -p invoice_generator_db < backend/laravel-api/schema.sql
   ```
5. *(Optional)* Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=invoice_generator_db
   ```

---

## 🌐 Laravel 11 Integration (Optional)

If you wish to run the backend as a full **Laravel 11 PHP** framework application:

1. Create or open your Laravel 11 project:
   ```bash
   composer create-project laravel/laravel invoice-backend
   ```
2. Copy the pre-built files from `backend/laravel-api/`:
   - Copy `app/Http/Controllers/` to your Laravel `app/Http/Controllers/`
   - Copy `routes/api.php` to your Laravel `routes/api.php`
   - Run the migration schema: `backend/laravel-api/schema.sql`
3. Serve the Laravel app:
   ```bash
   php artisan serve --port=8000
   ```
4. Update `frontend/vite.config.ts` target to `http://127.0.0.1:8000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all inventory products |
| `POST` | `/api/products` | Add a new product to inventory |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete a product from catalog |
| `GET` | `/api/invoices` | List all saved invoices with metadata |
| `POST` | `/api/invoices` | Save a new generated invoice |
| `GET` | `/api/invoices/:id` | Fetch single invoice details |
| `PUT` | `/api/invoices/:id/status` | Update invoice lifecycle status |
| `DELETE` | `/api/invoices/:id` | Remove invoice record |
| `GET` | `/api/companies` | List saved seller company profiles |
| `POST` | `/api/companies` | Register a new seller profile |
| `PUT` | `/api/companies/:id` | Edit a seller profile |
| `DELETE` | `/api/companies/:id` | Remove a seller profile |
| `GET` | `/api/stats` | Retrieve aggregate metrics (revenue, total invoices, paid count) |

---

## 📦 Building for Production

To create an optimized production build:

```bash
# Build both frontend (Vite) and backend (esbuild)
npm run build
```

- **Frontend Assets**: Output to `frontend/dist/` (ready for deployment to Vercel, Netlify, Cloudflare Pages, Nginx, or Apache).
- **Backend Bundle**: Output to `backend/server.js` (ready to run with `node server.js` or PM2).

To start the production server:
```bash
npm start
```

---

## ⌨️ Useful NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs frontend and backend concurrently in watch mode |
| `npm run dev:frontend` | Starts Vite frontend dev server only |
| `npm run dev:backend` | Starts Express backend server with live reload |
| `npm run build` | Compiles both frontend and backend for production |
| `npm run build:frontend` | Generates minified frontend bundle in `frontend/dist/` |
| `npm run build:backend` | Bundles backend into standalone `backend/server.js` |
| `npm run lint` | Runs TypeScript compiler checks across all workspaces |

---

## 📄 License

This project is open source and available under the [Apache-2.0 License](LICENSE).
