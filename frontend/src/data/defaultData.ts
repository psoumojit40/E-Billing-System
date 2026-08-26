import { CompanyDetails, CustomerDetails, ProductItem } from '../types';

export const PRESET_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    sku: 'PROD001',
    name: 'Product A',
    description: 'Premium product with enterprise level quality and SLA support',
    price: 500,
    gstRate: 18,
    hsnCode: '8471',
    unit: 'Pcs',
    stock: 120
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
    stock: 85
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
    stock: 240
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
    stock: 999
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
    stock: 500
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
    stock: 60
  }
];

export const DEFAULT_COMPANY: CompanyDetails = {
  companyName: '',
  tagline: '',
  companyAddress: '',
  phone: '',
  email: '',
  gstNumber: '',
  panNumber: '',
  website: '',
  companyLogo: '',
};

export const DEFAULT_COMPANIES = [
  {
    id: 'comp-1',
    companyName: 'Apex Enterprise Solutions Pvt. Ltd.',
    tagline: 'Enterprise Technology & Cloud Services',
    companyAddress: 'Plot 42, Tech Park Boulevard, Sector 5, Salt Lake, Kolkata, West Bengal 700091',
    phone: '+91 33 2948 1000',
    email: 'billing@apexenterprise.com',
    gstNumber: '19AAACA9876Q1Z2',
    panNumber: 'AAACA9876Q',
    website: 'https://apexenterprise.com',
    companyLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
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
  },
];

export const DEFAULT_CUSTOMER: CustomerDetails = {
  customerName: '',
  billingAddress: '',
  shippingAddress: '',
  sameAsBilling: true,
  phone: '',
  email: '',
  gstNumber: '',
  placeOfSupply: '',
};

export const DEFAULT_BANK_DETAILS = {
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branch: '',
  upiId: '',
};

export const DEFAULT_TERMS = `1. Payment is due within the agreed payment term from the date of invoice.
2. Please quote invoice number when remitting funds via NEFT/RTGS/UPI.
3. Interest @ 18% per annum will be charged on overdue payments beyond due date.
4. Goods/Services once billed cannot be returned unless agreed in writing.
5. All disputes are subject to Kolkata jurisdiction only.`;

export const DEFAULT_NOTES = `Thank you for your valued business. For any billing questions or support inquiries, contact billing@apexenterprise.com.`;
