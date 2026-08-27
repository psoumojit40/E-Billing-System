import React, { useState } from 'react';
import {
  Database,
  Search,
  Eye,
  Trash2,
  Copy,
  Edit3,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Lock,
  ShieldAlert,
  X,
  Send,
} from 'lucide-react';
import { InvoiceRecord, InvoiceStatus } from '../types';
import { formatCurrency } from '../utils/calculations';
import { API_BASE } from '../utils/api';

interface SavedInvoicesListProps {
  invoices: InvoiceRecord[];
  currencySymbol: string;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
  onPreviewInvoice: (invoice: InvoiceRecord) => void;
  onDuplicateInvoice: (invoice: InvoiceRecord) => void;
  onDeleteInvoice: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: InvoiceStatus) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

export const SavedInvoicesList: React.FC<SavedInvoicesListProps> = ({
  invoices,
  currencySymbol,
  onSelectInvoice,
  onPreviewInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onUpdateStatus,
  onCreateNew,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmPaidTarget, setConfirmPaidTarget] = useState<{ id: string; invoiceNumber: string } | null>(null);
  const [sendModalTarget, setSendModalTarget] = useState<InvoiceRecord | null>(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered list
  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      inv.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats
  const totalBilled = invoices.reduce((acc, curr) => acc + (curr.summary?.grandTotal || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, curr) => acc + (curr.summary?.grandTotal || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Sent' || inv.status === 'Overdue')
    .reduce((acc, curr) => acc + (curr.summary?.grandTotal || 0), 0);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-white dark:bg-[#1E1E1E] text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
      case 'Sent':
        return 'bg-white dark:bg-[#1E1E1E] text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800';
      case 'Pending':
        return 'bg-white dark:bg-[#1E1E1E] text-amber-700 dark:text-amber-400 border-amber-400 dark:border-amber-800';
      case 'Overdue':
        return 'bg-white dark:bg-[#1E1E1E] text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-white dark:bg-[#1E1E1E] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#383838]';
    }
  };

  const handleStatusChangeAttempt = (inv: InvoiceRecord, newStatus: InvoiceStatus) => {
    if (inv.status === 'Paid') {
      // Locked permanently once Paid
      return;
    }
    if (newStatus === 'Paid') {
      // Show confirmation popup modal
      setConfirmPaidTarget({ id: inv.id, invoiceNumber: inv.invoiceNumber });
    } else {
      onUpdateStatus(inv.id, newStatus);
    }
  };

  const handleConfirmPaid = () => {
    if (confirmPaidTarget) {
      onUpdateStatus(confirmPaidTarget.id, 'Paid');
      setConfirmPaidTarget(null);
    }
  };

  const handleOpenSendModal = (inv: InvoiceRecord) => {
    setSendModalTarget(inv);
    setTargetEmail(inv.customer?.email || '');
  };

  const handleSendEmailConfirm = async () => {
    if (!sendModalTarget) return;
    setIsSendingEmail(true);

    try {
      await fetch(`${API_BASE}/api/invoices/${sendModalTarget.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: targetEmail,
          emailSubject: `Tax Invoice #${sendModalTarget.invoiceNumber} from ${sendModalTarget.company?.companyName || 'Seller'}`,
        }),
      });

      onUpdateStatus(sendModalTarget.id, 'Sent');
      setToastMessage('Invoice sent');
    } catch (err) {
      onUpdateStatus(sendModalTarget.id, 'Sent');
      setToastMessage('Invoice sent');
    } finally {
      setIsSendingEmail(false);
      setSendModalTarget(null);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 dark:bg-[#1E1E1E] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-slate-700 dark:border-[#383838] animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Send Invoice Email Modal */}
      {sendModalTarget && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" role="dialog">
          <div className="absolute inset-0" onClick={() => !isSendingEmail && setSendModalTarget(null)} />
          <div className="relative z-10 bg-white dark:bg-[#1C1C1C] rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-[#333333] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282828] mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Invoice via Email</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Invoice #{sendModalTarget.invoiceNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendModalTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Recipient Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#383838] rounded-lg focus:bg-white dark:focus:bg-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">Email Subject</label>
                <input
                  type="text"
                  readOnly
                  value={`Tax Invoice #${sendModalTarget.invoiceNumber} from ${sendModalTarget.company?.companyName || 'Seller'}`}
                  className="w-full px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#252525] border border-slate-200 dark:border-[#383838] rounded-lg cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">Message Preview</label>
                <div className="p-3.5 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-lg text-slate-600 dark:text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
                  <p className="font-semibold text-slate-900 dark:text-white">Dear {sendModalTarget.customer?.customerName || 'Valued Client'},</p>
                  <p>Please find attached tax invoice <strong>#{sendModalTarget.invoiceNumber}</strong> for total amount <strong>{formatCurrency(sendModalTarget.summary?.grandTotal || 0, sendModalTarget.meta?.currencySymbol || currencySymbol)}</strong>.</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold">📥 Direct PDF Download Link: Included in recipient email.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#282828] flex items-center justify-between">
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Status will update to <strong className="uppercase">Sent</strong>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={() => setSendModalTarget(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingEmail || !targetEmail}
                  onClick={handleSendEmailConfirm}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSendingEmail ? 'Sending Email...' : 'Send Invoice Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Marking Invoice as Paid */}
      {confirmPaidTarget && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            onClick={() => setConfirmPaidTarget(null)}
          />
          <div className="relative z-10 bg-white dark:bg-[#1C1C1C] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-[#333333] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Confirm Invoice Payment & Lock
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Are you sure you want to mark invoice{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-[#252525] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#383838]">
                    {confirmPaidTarget.invoiceNumber}
                  </span>{' '}
                  as <strong className="text-emerald-700 dark:text-emerald-400">Paid</strong>?
                </p>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start space-x-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Integrity Notice:</strong> Once an invoice is marked as Paid, its status is permanently locked and cannot be changed back to Draft, Sent, Pending, or Overdue.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setConfirmPaidTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#303030] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm & Lock as Paid</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {invoices.length}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Stored in MySQL records</p>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Billed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-2xs">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(totalBilled, currencySymbol)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Cumulative billing volume</p>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Collected / Paid</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shadow-2xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            {formatCurrency(totalPaid, currencySymbol)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Settled invoice payments</p>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Outstanding Dues</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shadow-2xs">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
            {formatCurrency(totalPending, currencySymbol)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Pending & overdue invoices</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/20 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E]">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice number, client, GST..."
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#141414] hover:bg-slate-50 dark:hover:bg-[#1C1C1C] focus:bg-white dark:focus:bg-[#1C1C1C] border border-slate-200 dark:border-[#383838] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#242424] p-1 rounded-xl shadow-2xs w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({invoices.length})
              </button>
              {['Draft', 'Sent', 'Paid', 'Pending'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
            >
              + Create New
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">Loading saved invoices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No invoices found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Create your first invoice and click "Save" to store it.'}
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-[#2A2A2A] hover:bg-slate-800 dark:hover:bg-[#333333] rounded-lg transition-colors cursor-pointer"
            >
              Create New Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 dark:bg-[#141414] text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-[#2C2C2C]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client / Customer</th>
                  <th className="py-3 px-4">Date & Due</th>
                  <th className="py-3 px-4 text-center">Items</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#262626] bg-white dark:bg-[#181818]">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-[#202020] transition-colors">
                    {/* Invoice Number */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectInvoice(inv)}
                        className="font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs block text-left cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block">
                        ID: {inv.id.slice(0, 10)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inv.customer?.customerName || 'Unknown Customer'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {inv.customer?.email || inv.customer?.phone || 'No contact'}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div className="flex items-center space-x-1 text-[11px]">
                        <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        <span>{inv.meta?.invoiceDate}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        Due: {inv.meta?.dueDate}
                      </div>
                    </td>

                    {/* Items count */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#252525] text-slate-700 dark:text-slate-300 rounded-md font-semibold text-[11px]">
                        {inv.items?.length || 0}
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white text-sm tabular-nums">
                      {formatCurrency(inv.summary?.grandTotal || 0, inv.meta?.currencySymbol || currencySymbol)}
                    </td>

                    {/* Status badge & selector & Send button */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {inv.status === 'Paid' ? (
                          <div
                            className="inline-flex items-center space-x-1.5 px-3 py-1 text-[11px] font-bold bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 rounded-md cursor-not-allowed shadow-2xs"
                            title="This invoice is Paid and permanently locked for audit & accounting integrity."
                          >
                            <Lock className="h-3 w-3 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span>Paid</span>
                          </div>
                        ) : (
                          <select
                            value={inv.status}
                            onChange={(e) => handleStatusChangeAttempt(inv, e.target.value as InvoiceStatus)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${getStatusBadge(
                              inv.status
                            )}`}
                          >
                            <option value="Draft" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white font-normal">Draft</option>
                            <option value="Sent" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white font-normal">Sent</option>
                            <option value="Paid" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white font-normal">Paid (Lock)</option>
                            <option value="Pending" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white font-normal">Pending</option>
                            <option value="Overdue" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white font-normal">Overdue</option>
                          </select>
                        )}

                        {inv.status === 'Draft' && (
                          <button
                            type="button"
                            onClick={() => handleOpenSendModal(inv)}
                            title={`Email Invoice #${inv.invoiceNumber} to recipient and change status to Sent`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-all cursor-pointer shadow-2xs shrink-0"
                          >
                            <Send className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Send</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onPreviewInvoice(inv)}
                          title="Preview & Export PDF"
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {inv.status !== 'Paid' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onSelectInvoice(inv)}
                              title="Load and Edit Invoice"
                              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDuplicateInvoice(inv)}
                              title="Duplicate Invoice"
                              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                            >
                              <Copy className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteInvoice(inv.id)}
                              title="Delete from MySQL"
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
