import React from 'react';
import { Hash, RefreshCw } from 'lucide-react';
import { InvoiceMeta, PaymentTerms } from '../types';
import { calculateDueDate } from '../utils/calculations';

interface InvoiceMetaFormProps {
  meta: InvoiceMeta;
  onChange: (field: keyof InvoiceMeta, value: any) => void;
  onRegenerateInvoiceNumber: () => void;
}

const PAYMENT_TERMS_OPTIONS: PaymentTerms[] = [
  'Due on Receipt',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Custom',
];

export const InvoiceMetaForm: React.FC<InvoiceMetaFormProps> = ({
  meta,
  onChange,
  onRegenerateInvoiceNumber,
}) => {
  const handlePaymentTermsChange = (newTerms: PaymentTerms) => {
    onChange('paymentTerms', newTerms);
    if (newTerms !== 'Custom') {
      const calculatedDue = calculateDueDate(meta.invoiceDate, newTerms);
      onChange('dueDate', calculatedDue);
    }
  };

  const handleInvoiceDateChange = (newDate: string) => {
    onChange('invoiceDate', newDate);
    if (meta.paymentTerms !== 'Custom') {
      const calculatedDue = calculateDueDate(newDate, meta.paymentTerms);
      onChange('dueDate', calculatedDue);
    }
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      {/* Geometric Balanced Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-blue-50/30 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Document Parameters
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Invoice Meta & Schedule
            </h2>
          </div>
        </div>

        {/* Currency badge & Section identifier */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-[#242424] dark:to-[#1C1C1C] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#383838] shadow-2xs">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Currency:</span>
            <select
              id="currency-selector"
              value={meta.currency}
              onChange={(e) => {
                const val = e.target.value;
                onChange('currency', val);
                onChange('currencySymbol', val === 'USD' ? '$' : val === 'EUR' ? '€' : '₹');
              }}
              className="bg-transparent border-none focus:outline-none font-bold text-slate-900 dark:text-white cursor-pointer text-xs"
            >
              <option value="INR" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">INR (₹)</option>
              <option value="USD" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">USD ($)</option>
              <option value="EUR" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Invoice Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="invoice-number-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider">
                Invoice Number <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={onRegenerateInvoiceNumber}
                title="Generate new unique invoice number"
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center space-x-1 font-bold uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw className="h-2.5 w-2.5" />
                <span>Regen</span>
              </button>
            </div>
            <input
              id="invoice-number-input"
              type="text"
              required
              value={meta.invoiceNumber}
              onChange={(e) => onChange('invoiceNumber', e.target.value)}
              placeholder="INV-202608-0001"
              className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono font-bold tracking-wide transition-all"
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label htmlFor="invoice-date-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Invoice Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="invoice-date-input"
              type="date"
              required
              value={meta.invoiceDate}
              onChange={(e) => handleInvoiceDateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-mono font-bold"
            />
          </div>

          {/* Payment Terms */}
          <div>
            <label htmlFor="payment-terms-select" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Payment Terms
            </label>
            <select
              id="payment-terms-select"
              value={meta.paymentTerms}
              onChange={(e) => handlePaymentTermsChange(e.target.value as PaymentTerms)}
              className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all cursor-pointer font-medium"
            >
              {PAYMENT_TERMS_OPTIONS.map((term) => (
                <option key={term} value={term} className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">
                  {term}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due-date-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="due-date-input"
              type="date"
              required
              value={meta.dueDate}
              onChange={(e) => onChange('dueDate', e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-mono font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
