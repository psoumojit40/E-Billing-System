import { InvoiceItem, InvoiceSummary, PaymentTerms } from '../types';

/**
 * Format currency in Indian standard format (e.g. ₹ 1,50,000.00)
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount)) return `${symbol}0.00`;
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format number with Indian comma separation
 */
export function formatNumber(value: number): string {
  if (isNaN(value)) return '0.00';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Generate a unique sequential invoice number
 */
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}${month}-${randomSuffix}`;
}

/**
 * Calculate due date based on invoice date and payment terms
 */
export function calculateDueDate(invoiceDateStr: string, terms: PaymentTerms): string {
  const date = new Date(invoiceDateStr || new Date());
  if (isNaN(date.getTime())) return invoiceDateStr;

  let daysToAdd = 0;
  switch (terms) {
    case 'Due on Receipt':
      daysToAdd = 0;
      break;
    case 'Net 15':
      daysToAdd = 15;
      break;
    case 'Net 30':
      daysToAdd = 30;
      break;
    case 'Net 45':
      daysToAdd = 45;
      break;
    case 'Net 60':
      daysToAdd = 60;
      break;
    default:
      daysToAdd = 30;
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate single invoice line item amounts
 */
export function calculateInvoiceItem(
  price: number,
  quantity: number,
  gstRate: number,
  discountPercent: number = 0
): { taxableAmount: number; gstAmount: number; total: number } {
  const gross = Math.max(0, price) * Math.max(0, quantity);
  const discount = gross * (Math.min(100, Math.max(0, discountPercent)) / 100);
  const taxableAmount = Math.max(0, gross - discount);
  const gstAmount = taxableAmount * (Math.max(0, gstRate) / 100);
  const total = taxableAmount + gstAmount;

  return {
    taxableAmount: Number(taxableAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

/**
 * Calculate comprehensive Invoice summary
 */
export function calculateInvoiceSummary(
  items: InvoiceItem[],
  globalDiscountType: 'percent' | 'fixed',
  globalDiscountValue: number,
  isInterState: boolean
): InvoiceSummary {
  const itemsCount = items.length;
  let totalQuantity = 0;
  let subtotal = 0;
  let itemDiscountTotal = 0;
  let totalTax = 0;

  items.forEach((item) => {
    totalQuantity += Number(item.quantity) || 0;
    const gross = (Number(item.price) || 0) * (Number(item.quantity) || 0);
    const itemDisc = gross * ((Number(item.discountPercent) || 0) / 100);
    subtotal += gross;
    itemDiscountTotal += itemDisc;
    totalTax += Number(item.gstAmount) || 0;
  });

  const taxableBeforeGlobal = subtotal - itemDiscountTotal;

  // Calculate global discount
  let globalDiscountAmount = 0;
  if (globalDiscountType === 'percent') {
    const pct = Math.min(100, Math.max(0, Number(globalDiscountValue) || 0));
    globalDiscountAmount = (taxableBeforeGlobal * pct) / 100;
  } else {
    globalDiscountAmount = Math.min(
      taxableBeforeGlobal,
      Math.max(0, Number(globalDiscountValue) || 0)
    );
  }

  const taxableSubtotal = Math.max(0, taxableBeforeGlobal - globalDiscountAmount);

  // If global discount is applied, adjust tax proportionally
  let effectiveTotalTax = 0;
  if (taxableBeforeGlobal > 0 && globalDiscountAmount > 0) {
    const discountRatio = taxableSubtotal / taxableBeforeGlobal;
    effectiveTotalTax = totalTax * discountRatio;
  } else {
    effectiveTotalTax = totalTax;
  }

  // GST split
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = Number(effectiveTotalTax.toFixed(2));
    cgstAmount = 0;
    sgstAmount = 0;
  } else {
    cgstAmount = Number((effectiveTotalTax / 2).toFixed(2));
    sgstAmount = Number((effectiveTotalTax / 2).toFixed(2));
    igstAmount = 0;
  }

  const exactGrandTotal = taxableSubtotal + effectiveTotalTax;
  const roundedGrandTotal = Math.round(exactGrandTotal);
  const roundOff = Number((roundedGrandTotal - exactGrandTotal).toFixed(2));

  return {
    itemsCount,
    totalQuantity,
    subtotal: Number(subtotal.toFixed(2)),
    itemDiscountTotal: Number(itemDiscountTotal.toFixed(2)),
    globalDiscountType,
    globalDiscountValue: Number(globalDiscountValue) || 0,
    globalDiscountAmount: Number(globalDiscountAmount.toFixed(2)),
    taxableSubtotal: Number(taxableSubtotal.toFixed(2)),
    isInterState,
    cgstRate: 9, // indicative average display
    cgstAmount,
    sgstRate: 9,
    sgstAmount,
    igstRate: 18,
    igstAmount,
    totalTax: Number(effectiveTotalTax.toFixed(2)),
    roundOff,
    grandTotal: roundedGrandTotal,
    amountInWords: numberToWordsIndian(roundedGrandTotal),
  };
}

/**
 * Convert number to words in Indian numbering system (Crores, Lakhs, Thousands, Hundreds)
 */
export function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Rupees Zero Only';
  if (num < 0) return 'Minus ' + numberToWordsIndian(Math.abs(num));

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return `${b[tens]} ${a[units]}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    let res = '';
    if (hundreds > 0) {
      res += `${a[hundreds]} Hundred `;
    }
    if (remainder > 0) {
      res += convertTwoDigits(remainder);
    }
    return res.trim();
  }

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remaining = Math.floor(num);

  let result = '';

  if (crore > 0) {
    result += `${convertTwoDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    result += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    result += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (remaining > 0) {
    result += `${convertThreeDigits(remaining)} `;
  }

  result = result.trim();
  return result ? `Rupees ${result} Only` : 'Rupees Zero Only';
}
