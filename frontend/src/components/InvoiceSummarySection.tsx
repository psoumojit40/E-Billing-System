import React from 'react';
import {
  Calculator,
  Landmark,
  FileText,
  Receipt,
  RotateCcw,
  Save,
} from 'lucide-react';
import { BankDetails, InvoiceSummary } from '../types';
import { formatCurrency } from '../utils/calculations';

interface InvoiceSummarySectionProps {
  summary: InvoiceSummary;
  currencySymbol: string;
  bankDetails: BankDetails;
  notes: string;
  termsAndConditions: string;
  onGlobalDiscountChange: (type: 'percent' | 'fixed', value: number) => void;
  onInterStateToggle: (isInterState: boolean) => void;
  onBankDetailsChange: (field: keyof BankDetails, value: string) => void;
  onNotesChange: (notes: string) => void;
  onTermsChange: (terms: string) => void;
  onGenerateInvoice?: () => void;
  onSaveInvoice?: () => void;
  onClearInvoice?: () => void;
}

export const InvoiceSummarySection: React.FC<InvoiceSummarySectionProps> = ({
  summary,
  currencySymbol,
  bankDetails,
  notes,
  termsAndConditions,
  onGlobalDiscountChange,
  onInterStateToggle,
  onBankDetailsChange,
  onNotesChange,
  onTermsChange,
  onGenerateInvoice,
  onSaveInvoice,
  onClearInvoice,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Bank Coordinates, Notes & Terms (7 columns on large) */}
      <div className="lg:col-span-7 space-y-5">
        {/* Bank & Remittance Information Card */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500"></div>
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-amber-50/20 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Banking & Remittance
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Settlement Account Details
                </h3>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="bank-name-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                Bank Name
              </label>
              <input
                id="bank-name-input"
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => onBankDetailsChange('bankName', e.target.value)}
                placeholder="Enter bank name (e.g. HDFC Bank)"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="bank-acc-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                Account Number
              </label>
              <input
                id="bank-acc-input"
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => onBankDetailsChange('accountNumber', e.target.value)}
                placeholder="Enter account number"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold transition-all shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="bank-ifsc-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                IFSC / SWIFT Code
              </label>
              <input
                id="bank-ifsc-input"
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => onBankDetailsChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="Enter IFSC / SWIFT code"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono uppercase font-bold transition-all shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="bank-branch-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                Branch Location
              </label>
              <input
                id="bank-branch-input"
                type="text"
                value={bankDetails.branch}
                onChange={(e) => onBankDetailsChange('branch', e.target.value)}
                placeholder="Enter branch location"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all shadow-2xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bank-upi-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                UPI ID / VPA (Optional)
              </label>
              <input
                id="bank-upi-input"
                type="text"
                value={bankDetails.upiId || ''}
                onChange={(e) => onBankDetailsChange('upiId', e.target.value)}
                placeholder="Enter UPI ID (e.g. company@upi)"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Notes & Terms Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Notes */}
          <div className="bg-white dark:bg-[#181818] rounded-xl border border-slate-200/80 dark:border-[#2C2C2C] p-4 shadow-sm hover:shadow-md transition-all">
            <label htmlFor="invoice-notes-textarea" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileText className="h-3 w-3 text-indigo-500" />
              <span>Customer Notes</span>
            </label>
            <textarea
              id="invoice-notes-textarea"
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Thank you for your business..."
              className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-200 bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all shadow-2xs"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white dark:bg-[#181818] rounded-xl border border-slate-200/80 dark:border-[#2C2C2C] p-4 shadow-sm hover:shadow-md transition-all">
            <label htmlFor="invoice-terms-textarea" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Receipt className="h-3 w-3 text-indigo-500" />
              <span>Terms & Conditions</span>
            </label>
            <textarea
              id="invoice-terms-textarea"
              rows={3}
              value={termsAndConditions}
              onChange={(e) => onTermsChange(e.target.value)}
              placeholder="1. Payment due within specified period. 2. Goods once sold are not returnable..."
              className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-200 bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Financial Calculation Breakdown (5 columns on large) */}
      <div className="lg:col-span-5 bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500"></div>
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/30 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Computation
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Financial Summary
              </h3>
            </div>
          </div>

          {/* GST Supply Type Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#252525] p-0.5 rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => onInterStateToggle(false)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                !summary.isInterState
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Intra (CGST+SGST)
            </button>
            <button
              type="button"
              onClick={() => onInterStateToggle(true)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                summary.isInterState
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Inter (IGST)
            </button>
          </div>
        </div>

        {/* Calculation Rows */}
        <div className="p-5 space-y-3 text-xs">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="font-medium">Subtotal ({summary.totalQuantity} items):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(summary.subtotal, currencySymbol)}
            </span>
          </div>

          {/* Item-level discount if any */}
          {summary.itemDiscountTotal > 0 && (
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
              <span className="font-medium">Item Discounts:</span>
              <span className="font-mono font-bold tabular-nums">
                -{formatCurrency(summary.itemDiscountTotal, currencySymbol)}
              </span>
            </div>
          )}

          {/* Global Discount Input Row */}
          <div className="py-2.5 px-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-[#222222] dark:to-[#1C1C1C] rounded-xl border border-slate-200/80 dark:border-[#333333] shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Additional Discount:
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => onGlobalDiscountChange('percent', summary.globalDiscountValue)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    summary.globalDiscountType === 'percent'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-200 dark:bg-[#333333] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#444444]'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => onGlobalDiscountChange('fixed', summary.globalDiscountValue)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    summary.globalDiscountType === 'fixed'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-200 dark:bg-[#333333] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#444444]'
                  }`}
                >
                  {currencySymbol}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={summary.globalDiscountValue}
                onChange={(e) =>
                  onGlobalDiscountChange(
                    summary.globalDiscountType,
                    Math.max(0, parseFloat(e.target.value) || 0)
                  )
                }
                placeholder="0"
                className="w-24 px-2.5 py-1 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold tabular-nums shadow-2xs"
              />
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-xs">
                -{formatCurrency(summary.globalDiscountAmount, currencySymbol)}
              </span>
            </div>
          </div>

          {/* Taxable Subtotal */}
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold pt-2 border-t border-slate-100 dark:border-[#282828]">
            <span>Taxable Amount:</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(summary.taxableSubtotal, currencySymbol)}
            </span>
          </div>

          {/* Tax Breakdown */}
          {summary.isInterState ? (
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pl-2.5 border-l-2 border-indigo-600">
              <span className="text-[11px] font-medium">Integrated GST (IGST):</span>
              <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                +{formatCurrency(summary.igstAmount, currencySymbol)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pl-2.5 border-l-2 border-indigo-600">
                <span className="text-[11px] font-medium">Central GST (CGST):</span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                  +{formatCurrency(summary.cgstAmount, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pl-2.5 border-l-2 border-indigo-600">
                <span className="text-[11px] font-medium">State GST (SGST):</span>
                <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                  +{formatCurrency(summary.sgstAmount, currencySymbol)}
                </span>
              </div>
            </>
          )}

          {/* Total Tax */}
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold">
            <span>Total GST Tax:</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(summary.totalTax, currencySymbol)}
            </span>
          </div>

          {/* Round Off */}
          {summary.roundOff !== 0 && (
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Round Off:</span>
              <span className="font-mono tabular-nums">
                {summary.roundOff > 0 ? '+' : ''}
                {formatCurrency(summary.roundOff, currencySymbol)}
              </span>
            </div>
          )}

          {/* Grand Total Box */}
          <div className="mt-4 pt-4 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 dark:from-[#111111] dark:via-[#161616] dark:to-[#1B1B1B] text-white p-5 rounded-xl shadow-xl shadow-slate-950/20 border border-slate-800/80 dark:border-[#383838] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-baseline justify-between mb-1 relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Grand Total
                </span>
                <p className="text-[10px] text-slate-400">Inclusive of all taxes & discounts</p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums text-white">
                  {formatCurrency(summary.grandTotal, currencySymbol)}
                </span>
              </div>
            </div>

            {/* Amount In Words */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/90 dark:border-[#383838] text-[11px] text-slate-300 relative z-10">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-0.5">In Words:</span>
              <span className="italic font-medium text-slate-200 leading-tight block">
                {summary.amountInWords}
              </span>
            </div>
          </div>

          {/* Action Buttons: Clear, Save, Generate Invoice */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
            {onClearInvoice && (
              <button
                type="button"
                onClick={onClearInvoice}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Clear</span>
              </button>
            )}
            {onSaveInvoice && (
              <button
                id="summary-save-db-btn"
                type="button"
                onClick={onSaveInvoice}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#333333] rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 shadow-2xs"
              >
                <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                <span>Save</span>
              </button>
            )}
            {onGenerateInvoice && (
              <button
                id="summary-generate-invoice-btn"
                type="button"
                onClick={onGenerateInvoice}
                className="flex-1 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Invoice</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
