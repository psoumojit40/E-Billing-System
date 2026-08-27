# 🧾 E-Billing System - Enterprise Product Invoice Generator

A modern, full-featured GST billing, inventory management, and tax invoice generation platform built with a decoupled architecture (**React 19 + TypeScript + Tailwind CSS** frontend and **Laravel 11 + MySQL** REST API backend).

Designed for enterprises, SMEs, freelancers, and merchants to generate statutory A4 tax invoices, manage multi-company profiles, maintain product catalogs, and export high-resolution PDFs.

---

## 🌟 Features Overview

### ⚡ 1. Intelligent Invoice Builder
* **Dynamic Line Items**: Add, edit, or delete items on the fly with real-time computations.
* **Catalog Autocomplete**: Select pre-configured products from inventory with instant auto-fill of SKU, description, unit price, HSN code, and GST rate.
* **Dual Discount Engine**: Apply individual percentage discounts per line item or a global discount (percentage or flat amount) across the invoice.
* **Auto Due-Date Computation**: Calculates payment due dates dynamically based on standard terms.
* **Indian Currency Formatting & Words**: Accurate Indian Rupee standard format (`₹ 1,50,000.00`) and automatic currency-to-words conversion.

### 🏛️ 2. Statutory GST Tax Engine
* **Intra-State vs. Inter-State**: One-click toggle between Intra-State (**CGST + SGST**) and Inter-State (**IGST**) tax rules.
* **Multi-Tier GST Brackets**: Full support for statutory tax slabs (**0% Exempt**, **5% Essential**, **12% Standard Low**, **18% Standard Enterprise**, and **28% Luxury/Premium**).
* **Tax Breakdown Summary**: Clear tax ledger displaying taxable value, total taxes, and mathematical round-off adjustments.

### 📄 3. Pixel-Perfect A4 PDF & Native Print
* **High-Resolution Vector/Canvas PDF**: Generates pristine, print-ready A4 PDF documents.
* **Universal Paper Isolation**: Printable invoices remain pure white with sharp black typography in both Light and Dark modes.

### 🏢 4. Multi-Company Seller Profiles Registry
* **Multiple Organization Support**: Save and manage multiple seller entities with distinct branding, GSTINs, addresses, and banking details.
* **Logo Uploader**: Upload and store high-resolution brand logos.

### 📦 5. Live Product Inventory Catalog
* **Product Catalog Modal**: Create, update, search, and delete inventory items.
* **Stock & SKU Tracking**: Track stock quantities, Units of Measure, and statutory HSN/SAC codes.

### 💾 6. Invoice Database & Audit Trail
* **Saved Invoices Workspace**: Filter invoices by status (*All, Draft, Sent, Paid, Pending, Overdue*) or search by customer name, invoice number, or amount.
* **Instant Status Updates**: Update invoice lifecycle stages seamlessly.

### 🌙 7. Global 5-Shade Monochrome Dark Theme
* **Modern Aesthetic**: Dark mode featuring deep charcoal canvas backgrounds, elevated cards, and refined borders.
* **Top-Right Quick Toggle**: Toggle between Dark and Light mode instantly.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Build & Tooling** | Vite 6, PostCSS, Autoprefixer |
| **PDF & Print Engine** | jsPDF, html2canvas |
| **Backend REST API** | Laravel 11, PHP 8.2+ |
| **Database** | MySQL / TiDB Cloud |
| **Deployment** | Vercel (Frontend), Render/Docker (Backend) |

---

## 📁 Repository Structure

```
product-invoice-generator/
├── frontend/                     # React 19 + TypeScript UI Project
│   ├── src/                      # Source code (Components, Utils, Types)
│   ├── index.html                # Vite HTML template
│   ├── vite.config.ts            # Frontend build and dev server config
│   ├── package.json              # Frontend dependencies
│   └── ...
├── backend/                      # Laravel 11 REST API Backend
│   ├── app/                      # Controllers, Models, etc.
│   ├── database/                 # Migrations and Seeders
│   ├── routes/                   # API Routes (api.php)
│   ├── composer.json             # PHP dependencies
│   ├── .env.example              # Example environment variables
│   └── ...
├── Dockerfile                    # Docker configuration for backend deployment
└── README.md                     # Documentation & Setup Guide
```

---

## 🚀 How to Run Locally

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
* **PHP**: `v8.2` or higher ([Download PHP](https://www.php.net/))
* **Composer**: For managing PHP dependencies ([Download Composer](https://getcomposer.org/))
* **MySQL**: Running locally (via XAMPP, MAMP, Docker, etc.) or a remote database like TiDB Cloud.

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/product-invoice-generator.git
cd product-invoice-generator
```

### Step 2: Setup the Backend (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies using Composer:
   ```bash
   composer install
   ```
3. Copy the `.env.example` file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Generate the Laravel application key:
   ```bash
   php artisan key:generate
   ```
5. Configure your database connection in the `backend/.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   ```
   *(If using TiDB Cloud or another cloud provider with SSL, make sure to add `MYSQL_ATTR_SSL_CA` to your environment variables if required).*

6. Run the database migrations to create the required tables:
   ```bash
   php artisan migrate
   ```
7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   > The backend API will now be running on `http://127.0.0.1:8000`.

### Step 3: Setup the Frontend (React + Vite)

Open a **new terminal window/tab** and navigate to the frontend directory:

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create an `.env` file in the `frontend` directory to link the frontend to the backend:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The frontend UI will now be accessible at `http://localhost:5173`.

---

## 🌐 Deployment Notes

- **Frontend**: Can be easily deployed on platforms like **Vercel** or **Netlify**. Make sure to configure the `VITE_API_URL` environment variable in the deployment settings to point to your live backend.
- **Backend**: Can be deployed on **Render**, **Heroku**, or an **AWS/DigitalOcean VPS** using the provided `Dockerfile`. Set the appropriate database (`DB_HOST`, `DB_PASSWORD`, etc.) environment variables for your production database.
