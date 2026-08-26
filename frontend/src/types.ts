export interface CompanyDetails {
  companyName: string;
  companyAddress: string;
  phone: string;
  email: string;
  gstNumber: string;
  website: string;
  companyLogo: string;
  tagline?: string;
  panNumber?: string;
}

export interface SavedCompany extends CompanyDetails {
  id: string;
  created_at?: string;
}

export interface CustomerDetails {
  customerName: string;
  billingAddress: string;
  shippingAddress: string;
  sameAsBilling: boolean;
  phone: string;
  email: string;
  gstNumber: string;
  stateCode?: string;
  placeOfSupply?: string;
}

export type PaymentTerms = 'Due on Receipt' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60' | 'Custom';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Pending' | 'Overdue';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId?: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  status: InvoiceStatus;
  currency: string;
  currencySymbol: string;
  poNumber?: string;
  notes: string;
  termsAndConditions: string;
  bankDetails: BankDetails;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  gstRate: number; // e.g. 18 for 18%
  hsnCode?: string;
  unit?: string; // e.g. 'Pcs', 'Hrs', 'Units', 'Sets'
  stock?: number;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  price: number; // Unit price before tax
  gstRate: number; // GST % (0, 5, 12, 18, 28)
  hsnCode?: string;
  unit?: string;
  discountPercent?: number; // Optional item-level discount %
  taxableAmount: number;
  gstAmount: number;
  total: number;
}

export interface InvoiceSummary {
  itemsCount: number;
  totalQuantity: number;
  subtotal: number; // Sum of price * qty before discount
  itemDiscountTotal: number;
  globalDiscountType: 'percent' | 'fixed';
  globalDiscountValue: number;
  globalDiscountAmount: number;
  taxableSubtotal: number;
  isInterState: boolean; // if true -> IGST, if false -> CGST + SGST
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
  company: CompanyDetails;
  customer: CustomerDetails;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  summary: InvoiceSummary;
  status: InvoiceStatus;
}
