import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Printer,
  Save,
  FileCheck,
  Building,
  Landmark,
} from 'lucide-react';
import { CompanyDetails, CustomerDetails, InvoiceItem, InvoiceMeta, InvoiceSummary } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { downloadInvoicePDF, printInvoice } from '../utils/pdfGenerator';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetails;
  customer: CustomerDetails;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  summary: InvoiceSummary;
  onSaveToDatabase: () => Promise<void>;
  isSaving?: boolean;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  company,
  customer,
  meta,
  items,
  summary,
  onSaveToDatabase,
  isSaving = false,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Reset scroll position to top whenever opened
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const fileName = `${meta.invoiceNumber || 'Invoice'}_${customer.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    await downloadInvoicePDF('invoice-printable-document', fileName);
    setIsGeneratingPdf(false);
  };

  const handleSaveAndNotify = async () => {
    await onSaveToDatabase();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      id="invoice-preview-modal-overlay"
    >
      {/* Click outside to close backdrop */}
      <div id="invoice-preview-modal-backdrop" className="absolute inset-0 no-print" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Dialog Box */}
      <div className="relative z-10 bg-white dark:bg-[#141414] rounded-lg shadow-2xl max-w-5xl w-full h-[92vh] max-h-[92vh] flex flex-col overflow-hidden border border-slate-700 dark:border-[#2C2C2C] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar */}
        <div id="invoice-modal-topbar" className="no-print flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900 dark:bg-[#181818] text-white border-b border-slate-800 dark:border-[#2C2C2C] shrink-0 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="hidden sm:inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                  Generated Invoice Document
                </span>
                <span className="sm:hidden text-xs font-bold uppercase tracking-wider text-white">
                  Invoice
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 rounded border border-slate-700 truncate max-w-[110px] sm:max-w-none">
                  #{meta.invoiceNumber}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-slate-800 text-emerald-400 rounded border border-slate-700">
                  {meta.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                A4 Compliant GST Tax Invoice ready for download and physical printing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              id="preview-save-btn"
              type="button"
              onClick={handleSaveAndNotify}
              disabled={isSaving}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <Save className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{savedSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
              id="preview-print-btn"
              type="button"
              onClick={() => printInvoice('invoice-printable-document')}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            <button
              id="preview-download-pdf-btn"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span>
                {isGeneratingPdf ? (
                  'PDF...'
                ) : (
                  <>
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </>
                )}
              </span>
            </button>

            <button
              id="preview-close-btn"
              type="button"
              onClick={onClose}
              title="Close Preview"
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0 ml-0.5"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div
          id="invoice-modal-scroll-container"
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-8 bg-slate-900/90 flex justify-center backdrop-blur-sm"
        >
          {/* Authentic Printable A4 Tax Invoice Canvas (Full Monochrome Black & White) */}
          <div
            id="invoice-printable-document"
            className="w-full max-w-[820px] bg-white rounded-xl shadow-2xl border border-slate-300 text-slate-900 p-6 sm:p-8 font-sans print:shadow-none print:border-none print:p-0 my-0 h-fit"
          >
            {/* Header: Company & Tax Invoice Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-black gap-4">
              {/* Company Identity */}
              <div className="space-y-1.5 max-w-md">
                {company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt="Company Logo"
                    className="h-12 max-w-[180px] object-contain mb-2 filter grayscale"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-black font-extrabold text-xl mb-1">
                    <Building className="h-6 w-6 text-black" />
                    <span>{company.companyName}</span>
                  </div>
                )}

                <h1 className="text-base font-extrabold text-black tracking-tight">
                  {company.companyName}
                </h1>
                {company.tagline && (
                  <p className="text-xs text-slate-600 font-medium">{company.tagline}</p>
                )}
                <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                  {company.companyAddress}
                </p>
                <div className="text-[11px] text-slate-700 pt-1 space-y-0.5">
                  <p><span className="font-semibold text-slate-900">GSTIN:</span> <span className="font-mono">{company.gstNumber}</span></p>
                  <p><span className="font-semibold text-slate-900">Phone:</span> {company.phone} • <span className="font-semibold text-slate-900">Email:</span> {company.email}</p>
                  {company.website && <p><span className="font-semibold text-slate-900">Web:</span> {company.website}</p>}
                </div>
              </div>

              {/* Invoice Meta Top Right */}
              <div className="text-left sm:text-right space-y-2 shrink-0">
                <div className="inline-block bg-black text-white px-3.5 py-1 text-xs font-extrabold tracking-wider uppercase rounded-none">
                  Tax Invoice
                </div>

                <div className="text-xs space-y-1">
                  <p>
                    <span className="text-slate-600 font-medium">Invoice No:</span>{' '}
                    <span className="font-mono font-bold text-black text-sm">{meta.invoiceNumber}</span>
                  </p>
                  <p>
                    <span className="text-slate-600 font-medium">Invoice Date:</span>{' '}
                    <span className="font-semibold text-black">{meta.invoiceDate}</span>
                  </p>
                  <p>
                    <span className="text-slate-600 font-medium">Due Date:</span>{' '}
                    <span className="font-semibold text-black">{meta.dueDate}</span>
                  </p>
                  <p>
                    <span className="text-slate-600 font-medium">Payment Terms:</span>{' '}
                    <span className="font-semibold text-black">{meta.paymentTerms}</span>
                  </p>
                  {meta.poNumber && (
                    <p>
                      <span className="text-slate-600 font-medium">PO Reference:</span>{' '}
                      <span className="font-mono font-semibold text-black">{meta.poNumber}</span>
                    </p>
                  )}
                  {customer.placeOfSupply && (
                    <p>
                      <span className="text-slate-600 font-medium">Place of Supply:</span>{' '}
                      <span className="font-semibold text-black">{customer.placeOfSupply}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Billed To / Shipped To Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 my-2 border-b border-slate-300 text-xs">
              {/* Billed To */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  Billed To (Client / Buyer)
                </span>
                <h3 className="text-sm font-bold text-black">{customer.customerName}</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {customer.billingAddress}
                </p>
                <div className="pt-1 text-slate-700 space-y-0.5">
                  {customer.gstNumber && (
                    <p><span className="font-semibold text-slate-900">GSTIN:</span> <span className="font-mono font-medium">{customer.gstNumber}</span></p>
                  )}
                  {customer.phone && <p><span className="font-semibold text-slate-900">Phone:</span> {customer.phone}</p>}
                  {customer.email && <p><span className="font-semibold text-slate-900">Email:</span> {customer.email}</p>}
                </div>
              </div>

              {/* Shipped To */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  Shipped To / Consignee
                </span>
                <h3 className="text-sm font-bold text-black">{customer.customerName}</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {customer.shippingAddress || customer.billingAddress}
                </p>
              </div>
            </div>

            {/* Items Table with Responsive Scroll */}
            <div className="my-4 overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[560px] sm:min-w-full text-left text-xs border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 text-black font-bold border-b border-slate-400 text-[11px] sm:text-xs">
                    <th className="py-2 px-1.5 sm:px-2.5 text-center border-r border-slate-400 w-7 sm:w-8">#</th>
                    <th className="py-2 px-2 sm:px-3 border-r border-slate-400">
                      <span className="hidden sm:inline">Description of Goods / Services</span>
                      <span className="sm:hidden">Item & Description</span>
                    </th>
                    <th className="py-2 px-1.5 sm:px-2 text-center border-r border-slate-400 w-14 sm:w-16">
                      <span className="hidden sm:inline">HSN/SAC</span>
                      <span className="sm:hidden">HSN</span>
                    </th>
                    <th className="py-2 px-1.5 sm:px-2 text-center border-r border-slate-400 w-10 sm:w-12">Qty</th>
                    <th className="py-2 px-1.5 sm:px-2.5 text-right border-r border-slate-400 w-18 sm:w-20">Rate ({meta.currencySymbol})</th>
                    <th className="py-2 px-1 text-center border-r border-slate-400 w-10 sm:w-12">GST</th>
                    <th className="py-2 px-1.5 sm:px-2.5 text-right border-r border-slate-400 w-18 sm:w-20">Taxable</th>
                    <th className="py-2 px-1.5 sm:px-2.5 text-right w-20 sm:w-24">Total ({meta.currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {items.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-2 px-2 text-center text-slate-700 font-medium border-r border-slate-300">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-300">
                        <div className="font-bold text-black">{item.name}</div>
                        {item.description && (
                          <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.description}</div>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {item.sku}</div>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-700 border-r border-slate-300">
                        {item.hsnCode || '—'}
                      </td>
                      <td className="py-2 px-2 text-center font-semibold text-black border-r border-slate-300 tabular-nums">
                        {item.quantity} {item.unit || ''}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-800 border-r border-slate-300 tabular-nums">
                        {formatNumber(item.price)}
                      </td>
                      <td className="py-2 px-2 text-center font-semibold text-slate-800 border-r border-slate-300">
                        {item.gstRate}%
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-800 border-r border-slate-300 tabular-nums">
                        {formatNumber(item.taxableAmount)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-black tabular-nums">
                        {formatNumber(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax & Financial Summary Block */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4 pt-2">
              {/* Bank & Remittance coordinates (Left 7 Cols) */}
              <div className="sm:col-span-7 space-y-3">
                {/* Bank details box */}
                <div className="p-3 bg-slate-50 rounded border border-slate-300 text-xs">
                  <h4 className="font-bold text-black text-[11px] uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <Landmark className="h-3.5 w-3.5 text-black" />
                    <span>Bank & Wire Transfer Details</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-800">
                    <p><span className="text-slate-600">Bank:</span> {meta.bankDetails.bankName || '—'}</p>
                    <p><span className="text-slate-600">A/C No:</span> <span className="font-mono font-bold text-black">{meta.bankDetails.accountNumber || '—'}</span></p>
                    <p><span className="text-slate-600">IFSC Code:</span> <span className="font-mono uppercase font-semibold text-black">{meta.bankDetails.ifscCode || '—'}</span></p>
                    <p><span className="text-slate-600">Branch:</span> {meta.bankDetails.branch || '—'}</p>
                    {meta.bankDetails.upiId && (
                      <p className="col-span-2 pt-0.5"><span className="text-slate-600">UPI ID:</span> <span className="font-mono font-bold text-black">{meta.bankDetails.upiId}</span></p>
                    )}
                  </div>
                </div>

                {/* Amount in words */}
                <div className="p-2.5 bg-slate-50 rounded border border-slate-300 text-xs">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Total Amount In Words:
                  </span>
                  <p className="font-bold text-black italic mt-0.5">
                    {summary.amountInWords}
                  </p>
                </div>
              </div>

              {/* Calculations Right Block (Right 5 Cols) */}
              <div className="sm:col-span-5 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-700 py-0.5">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-medium text-black tabular-nums">
                    {formatCurrency(summary.taxableSubtotal, meta.currencySymbol)}
                  </span>
                </div>

                {summary.globalDiscountAmount > 0 && (
                  <div className="flex justify-between text-black py-0.5 font-medium">
                    <span>Discount:</span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(summary.globalDiscountAmount, meta.currencySymbol)}
                    </span>
                  </div>
                )}

                {summary.isInterState ? (
                  <div className="flex justify-between text-slate-700 py-0.5 border-t border-slate-300">
                    <span>IGST (Integrated Tax):</span>
                    <span className="font-mono text-black tabular-nums">
                      {formatCurrency(summary.igstAmount, meta.currencySymbol)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-700 py-0.5 border-t border-slate-300">
                      <span>CGST (Central Tax):</span>
                      <span className="font-mono text-black tabular-nums">
                        {formatCurrency(summary.cgstAmount, meta.currencySymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 py-0.5">
                      <span>SGST (State Tax):</span>
                      <span className="font-mono text-black tabular-nums">
                        {formatCurrency(summary.sgstAmount, meta.currencySymbol)}
                      </span>
                    </div>
                  </>
                )}

                {summary.roundOff !== 0 && (
                  <div className="flex justify-between text-slate-600 text-[11px] py-0.5">
                    <span>Round Off:</span>
                    <span className="font-mono tabular-nums">
                      {summary.roundOff > 0 ? '+' : ''}
                      {formatCurrency(summary.roundOff, meta.currencySymbol)}
                    </span>
                  </div>
                )}

                {/* Grand Total Bar */}
                <div className="flex justify-between items-center py-2 px-3 bg-black text-white rounded-none font-bold text-sm mt-2">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base tabular-nums text-white font-extrabold">
                    {formatCurrency(summary.grandTotal, meta.currencySymbol)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms, Notes & Signature Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 mt-4 border-t-2 border-black text-xs">
              {/* Terms & Notes */}
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Terms & Conditions:
                  </span>
                  <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-line mt-0.5">
                    {meta.termsAndConditions}
                  </p>
                </div>
                {meta.notes && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Notes:
                    </span>
                    <p className="text-[10px] text-slate-700 italic mt-0.5">{meta.notes}</p>
                  </div>
                )}
              </div>

              {/* Signature Box */}
              <div className="text-right flex flex-col justify-between items-end h-28">
                <span className="text-[10px] font-semibold text-slate-600">
                  For {company.companyName}
                </span>

                <div className="border-t border-black pt-1 w-44 text-center">
                  <span className="text-[11px] font-bold text-black block">
                    Authorized Signatory
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    (Digitally generated invoice)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
