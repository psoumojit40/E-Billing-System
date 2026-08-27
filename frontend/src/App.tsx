/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DEFAULT_COMPANY,
  DEFAULT_CUSTOMER,
  DEFAULT_BANK_DETAILS,
  DEFAULT_TERMS,
  DEFAULT_NOTES,
  PRESET_PRODUCTS,
  DEFAULT_COMPANIES,
} from './data/defaultData';
import {
  CompanyDetails,
  CustomerDetails,
  InvoiceItem,
  InvoiceMeta,
  InvoiceRecord,
  InvoiceStatus,
  InvoiceSummary,
  ProductItem,
} from './types';
import {
  calculateDueDate,
  calculateInvoiceItem,
  calculateInvoiceSummary,
  generateInvoiceNumber,
} from './utils/calculations';
import { Sidebar } from './components/Sidebar';
import { CompanyDetailsForm } from './components/CompanyDetailsForm';
import { CustomerDetailsForm } from './components/CustomerDetailsForm';
import { InvoiceMetaForm } from './components/InvoiceMetaForm';
import { ProductSelectorTable } from './components/ProductSelectorTable';
import { InvoiceSummarySection } from './components/InvoiceSummarySection';
import { InvoicePreviewModal } from './components/InvoicePreviewModal';
import { SavedInvoicesList } from './components/SavedInvoicesList';
import { ProductCatalogModal } from './components/ProductCatalogModal';
import { CheckCircle2, AlertCircle, Info, RotateCcw, Moon, Sun } from 'lucide-react';

import { CompanyManagerModal } from './components/CompanyManagerModal';
import { SavedCompany } from './types';
import { API_BASE } from './utils/api';

export default function App() {
  // Navigation tab: 'generator' | 'saved' | 'catalog' | 'companies'
  const [activeTab, setActiveTab] = useState<'generator' | 'saved' | 'catalog' | 'companies'>('generator');

  // Dark Mode State with LocalStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('ebilling_theme');
      if (savedTheme) return savedTheme === 'dark';
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('ebilling_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('ebilling_theme', 'light');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  // Preview & Clear Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Products catalog from database
  const [presetProducts, setPresetProducts] = useState<ProductItem[]>(PRESET_PRODUCTS);

  // Saved Invoices from database
  const [savedInvoices, setSavedInvoices] = useState<InvoiceRecord[]>([]);

  // Saved Seller Companies from database
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>(DEFAULT_COMPANIES);

  // Current editing invoice state
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);
  const [customer, setCustomer] = useState<CustomerDetails>(DEFAULT_CUSTOMER);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const initialDueStr = useMemo(() => calculateDueDate(todayStr, 'Net 30'), [todayStr]);

  const [meta, setMeta] = useState<InvoiceMeta>({
    invoiceNumber: generateInvoiceNumber('INV'),
    invoiceDate: todayStr,
    dueDate: initialDueStr,
    paymentTerms: 'Net 30',
    status: 'Draft',
    currency: 'INR',
    currencySymbol: '₹',
    poNumber: '',
    notes: DEFAULT_NOTES,
    termsAndConditions: DEFAULT_TERMS,
    bankDetails: DEFAULT_BANK_DETAILS,
  });

  // Initial Line Items (Clean & empty on fresh load/refresh)
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Global discount & GST settings
  const [globalDiscountType, setGlobalDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [globalDiscountValue, setGlobalDiscountValue] = useState<number>(0);
  const [isInterState, setIsInterState] = useState<boolean>(false);

  // Automatically calculate Summary on state changes
  const summary: InvoiceSummary = useMemo(() => {
    return calculateInvoiceSummary(items, globalDiscountType, globalDiscountValue, isInterState);
  }, [items, globalDiscountType, globalDiscountValue, isInterState]);

  // Fetch initial data from server APIs
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setPresetProducts(json.data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback for preset products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    setIsLoadingInvoices(true);
    try {
      const res = await fetch(`${API_BASE}/api/invoices`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSavedInvoices(json.data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback for invoices:', err);
    } finally {
      setIsLoadingInvoices(false);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    setIsLoadingCompanies(true);
    try {
      const res = await fetch(`${API_BASE}/api/companies`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSavedCompanies(json.data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback for companies:', err);
    } finally {
      setIsLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
    fetchCompanies();
  }, [fetchProducts, fetchInvoices, fetchCompanies]);

  // Company CRUD Handlers
  const handleAddCompany = async (newCompany: SavedCompany) => {
    try {
      const res = await fetch(`${API_BASE}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });
      if (res.ok) {
        const json = await res.json();
        setSavedCompanies((prev) => [json.data || newCompany, ...prev]);
        showToast('Saved company profile to MySQL database!', 'success');
      } else {
        setSavedCompanies((prev) => [newCompany, ...prev]);
        showToast('Saved company profile', 'success');
      }
    } catch (err) {
      setSavedCompanies((prev) => [newCompany, ...prev]);
      showToast('Saved company profile', 'success');
    }
  };

  const handleUpdateCompany = async (id: string, updated: Partial<SavedCompany>) => {
    try {
      const res = await fetch(`${API_BASE}/api/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const json = await res.json();
        setSavedCompanies((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...json.data } : c))
        );
        showToast('Updated company profile', 'success');
      } else {
        setSavedCompanies((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
        showToast('Updated company profile', 'success');
      }
    } catch (err) {
      setSavedCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      showToast('Updated company profile', 'success');
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/companies/${id}`, { method: 'DELETE' });
      setSavedCompanies((prev) => prev.filter((c) => c.id !== id));
      showToast('Company profile deleted', 'info');
    } catch (err) {
      setSavedCompanies((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSelectActiveCompany = (selectedComp: SavedCompany | CompanyDetails) => {
    setCompany({
      companyName: selectedComp.companyName,
      tagline: selectedComp.tagline || '',
      companyAddress: selectedComp.companyAddress,
      phone: selectedComp.phone,
      email: selectedComp.email,
      gstNumber: selectedComp.gstNumber,
      website: selectedComp.website,
      companyLogo: selectedComp.companyLogo,
    });
    setActiveTab('generator');
    showToast(`Applied ${selectedComp.companyName} seller details to active invoice`, 'success');
  };

  // Handlers for Company Details
  const handleCompanyChange = (field: keyof CompanyDetails, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for Customer Details
  const handleCustomerChange = (field: keyof CustomerDetails, value: any) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for Invoice Meta
  const handleMetaChange = (field: keyof InvoiceMeta, value: any) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegenerateInvoiceNumber = () => {
    const newNum = generateInvoiceNumber('INV');
    setMeta((prev) => ({ ...prev, invoiceNumber: newNum }));
    showToast(`Generated unique invoice number: ${newNum}`, 'info');
  };

  const handleClearInvoice = () => {
    setCompany(DEFAULT_COMPANY);
    setCustomer({
      customerName: '',
      billingAddress: '',
      shippingAddress: '',
      sameAsBilling: true,
      phone: '',
      email: '',
      gstNumber: '',
      placeOfSupply: '',
    });
    const newNum = generateInvoiceNumber('INV');
    setMeta({
      invoiceNumber: newNum,
      invoiceDate: todayStr,
      dueDate: initialDueStr,
      paymentTerms: 'Net 30',
      status: 'Draft',
      currency: 'INR',
      currencySymbol: '₹',
      poNumber: '',
      notes: DEFAULT_NOTES,
      termsAndConditions: DEFAULT_TERMS,
      bankDetails: DEFAULT_BANK_DETAILS,
    });
    setItems([]);
    setGlobalDiscountType('percent');
    setGlobalDiscountValue(0);
    setIsInterState(false);
    setShowClearConfirm(false);
    showToast('Invoice form cleared! Started fresh.', 'info');
  };

  // Line Item Handlers
  const handleAddItem = (product?: ProductItem) => {
    if (product) {
      const calc = calculateInvoiceItem(product.price, 1, product.gstRate, 0);
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        quantity: 1,
        price: product.price,
        gstRate: product.gstRate,
        hsnCode: product.hsnCode || '',
        unit: product.unit || 'Pcs',
        discountPercent: 0,
        taxableAmount: calc.taxableAmount,
        gstAmount: calc.gstAmount,
        total: calc.total,
      };
      setItems((prev) => [...prev, newItem]);
      showToast(`Added ${product.name} to invoice`, 'info');
    } else {
      const calc = calculateInvoiceItem(500, 1, 18, 0);
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sku: `ITEM${String(items.length + 1).padStart(3, '0')}`,
        name: 'Custom Service / Product',
        description: 'Standard consulting and implementation services',
        quantity: 1,
        price: 500,
        gstRate: 18,
        hsnCode: '9983',
        unit: 'Pcs',
        discountPercent: 0,
        taxableAmount: calc.taxableAmount,
        gstAmount: calc.gstAmount,
        total: calc.total,
      };
      setItems((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateItem = (index: number, updated: Partial<InvoiceItem>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDup = items[index];
    if (!itemToDup) return;
    const duplicated: InvoiceItem = {
      ...itemToDup,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${itemToDup.name} (Copy)`,
    };
    setItems((prev) => [...prev, duplicated]);
    showToast('Duplicated line item', 'info');
  };

  // Reset to brand new clean invoice
  const handleNewInvoice = () => {
    setCompany(DEFAULT_COMPANY);
    setCustomer(DEFAULT_CUSTOMER);
    setMeta({
      invoiceNumber: generateInvoiceNumber('INV'),
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date().toISOString().split('T')[0], 'Net 30'),
      paymentTerms: 'Net 30',
      status: 'Draft',
      currency: 'INR',
      currencySymbol: '₹',
      poNumber: '',
      notes: DEFAULT_NOTES,
      termsAndConditions: DEFAULT_TERMS,
      bankDetails: DEFAULT_BANK_DETAILS,
    });
    setItems([]);
    setGlobalDiscountValue(0);
    setActiveTab('generator');
    showToast('Initialized new blank invoice form', 'info');
  };

  // Save invoice to MySQL / backend database API
  const handleSaveInvoice = async (): Promise<void> => {
    if (!meta.invoiceNumber || items.length === 0) {
      showToast('Please enter an invoice number and at least one item', 'error');
      return;
    }

    setIsSaving(true);
    const invoicePayload: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: meta.invoiceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      company,
      customer,
      meta,
      items,
      summary,
      status: meta.status,
    };

    try {
      const res = await fetch(`${API_BASE}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload),
      });

      if (res.ok) {
        await res.json();
        showToast('Invoice saved', 'success');
        await fetchInvoices();
      } else {
        // Local state update fallback
        setSavedInvoices((prev) => {
          const filtered = prev.filter((i) => i.invoiceNumber !== meta.invoiceNumber);
          return [invoicePayload, ...filtered];
        });
        showToast('Invoice saved', 'success');
      }
    } catch (err) {
      // Local fallback
      setSavedInvoices((prev) => {
        const filtered = prev.filter((i) => i.invoiceNumber !== meta.invoiceNumber);
        return [invoicePayload, ...filtered];
      });
      showToast('Invoice saved', 'success');
    } finally {
      setIsSaving(false);
      // Refresh Create Invoice form to 100% clean blank state
      setCompany(DEFAULT_COMPANY);
      setCustomer(DEFAULT_CUSTOMER);
      setMeta({
        invoiceNumber: generateInvoiceNumber('INV'),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: calculateDueDate(new Date().toISOString().split('T')[0], 'Net 30'),
        paymentTerms: 'Net 30',
        status: 'Draft',
        currency: 'INR',
        currencySymbol: '₹',
        poNumber: '',
        notes: DEFAULT_NOTES,
        termsAndConditions: DEFAULT_TERMS,
        bankDetails: DEFAULT_BANK_DETAILS,
      });
      setItems([]);
      setGlobalDiscountType('percent');
      setGlobalDiscountValue(0);
      setIsInterState(false);
    }
  };

  // Load a saved invoice into current editor
  const handleSelectInvoice = (inv: InvoiceRecord) => {
    if (inv.company) setCompany(inv.company);
    if (inv.customer) setCustomer(inv.customer);
    if (inv.meta) setMeta(inv.meta);
    if (inv.items) setItems(inv.items);
    if (inv.summary) {
      setGlobalDiscountType(inv.summary.globalDiscountType || 'percent');
      setGlobalDiscountValue(inv.summary.globalDiscountValue || 0);
      setIsInterState(inv.summary.isInterState || false);
    }
    setActiveTab('generator');
    showToast(`Loaded invoice ${inv.invoiceNumber}`, 'info');
  };

  // Open Preview for specific saved invoice
  const handlePreviewSpecificInvoice = (inv: InvoiceRecord) => {
    if (inv.company) setCompany(inv.company);
    if (inv.customer) setCustomer(inv.customer);
    if (inv.meta) setMeta(inv.meta);
    if (inv.items) setItems(inv.items);
    if (inv.summary) {
      setGlobalDiscountType(inv.summary.globalDiscountType || 'percent');
      setGlobalDiscountValue(inv.summary.globalDiscountValue || 0);
      setIsInterState(inv.summary.isInterState || false);
    }
    setIsPreviewOpen(true);
  };

  // Duplicate an invoice
  const handleDuplicateInvoice = (inv: InvoiceRecord) => {
    const newInvoiceNumber = generateInvoiceNumber('INV');
    handleSelectInvoice({
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvoiceNumber,
      status: 'Draft',
      meta: {
        ...inv.meta,
        invoiceNumber: newInvoiceNumber,
        status: 'Draft',
        invoiceDate: new Date().toISOString().split('T')[0],
      },
    });
    showToast(`Duplicated invoice as ${newInvoiceNumber}`, 'info');
  };

  // Delete invoice from backend MySQL
  const handleDeleteInvoice = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Invoice deleted from database', 'info');
      }
      setSavedInvoices((prev) => prev.filter((i) => i.id !== id && i.invoiceNumber !== id));
    } catch (err) {
      setSavedInvoices((prev) => prev.filter((i) => i.id !== id && i.invoiceNumber !== id));
      showToast('Invoice deleted', 'info');
    }
  };

  // Update status in backend
  const handleUpdateStatus = async (id: string, newStatus: InvoiceStatus) => {
    try {
      await fetch(`${API_BASE}/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setSavedInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      showToast(`Updated status to ${newStatus}`, 'info');
    } catch (err) {
      setSavedInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    }
  };

  // Product Catalog management Handlers
  const handleAddProduct = async (product: Omit<ProductItem, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const json = await res.json();
        setPresetProducts((prev) => [json.data, ...prev]);
        showToast(`Product ${product.name} saved to MySQL catalog`, 'success');
      } else {
        const localProd: ProductItem = {
          ...product,
          id: `prod-${Date.now()}`,
        };
        setPresetProducts((prev) => [localProd, ...prev]);
        showToast(`Product ${product.name} added to catalog`, 'success');
      }
    } catch (err) {
      const localProd: ProductItem = {
        ...product,
        id: `prod-${Date.now()}`,
      };
      setPresetProducts((prev) => [localProd, ...prev]);
      showToast(`Product ${product.name} added`, 'success');
    }
  };

  const handleUpdateProduct = async (id: string, updated: Partial<ProductItem>) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const json = await res.json();
        setPresetProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...json.data } : p))
        );
        showToast(`Updated product details for ${updated.name || id}`, 'success');
      } else {
        setPresetProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
        showToast(`Updated product details`, 'success');
      }
    } catch (err) {
      setPresetProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      showToast(`Updated product details`, 'success');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
      setPresetProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed from catalog', 'info');
    } catch (err) {
      setPresetProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleResetProductDefaults = () => {
    setPresetProducts(PRESET_PRODUCTS);
    showToast('Reset product catalog to standard defaults', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 dark:from-[#0D0D0D] dark:via-[#121212] dark:to-[#171717] flex flex-col lg:flex-row text-slate-900 dark:text-slate-100 font-[Arial,sans-serif] relative selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Ambient background blur accents */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-300/15 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-300/15 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-from-bottom-3 duration-200">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-slate-900/95 dark:bg-[#1E1E1E]/95 text-white border-slate-800 dark:border-[#383838]'
                : toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-800'
                : 'bg-indigo-900/95 text-white border-indigo-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-indigo-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedInvoices.length}
        companyCount={savedCompanies.length}
        onPreviewInvoice={() => setIsPreviewOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden relative z-10">
        {/* Top Header Bar with View Breadcrumb & Top-Right Dark Mode Toggle */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Workspace
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {activeTab === 'generator' && 'Invoice Generator'}
              {activeTab === 'saved' && 'Saved Invoices'}
              {activeTab === 'catalog' && 'Product Catalog'}
              {activeTab === 'companies' && 'Company Profiles'}
            </span>
          </div>

          {/* Top Right Action Controls */}
          <div className="flex items-center space-x-2.5">

            {/* Dark Mode Toggle Button (Top Right Corner) */}
            <button
              id="dark-mode-toggle-btn"
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#252525] border border-slate-200 dark:border-[#383838] text-slate-800 dark:text-slate-200 rounded-xl text-xs font-extrabold shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-90 duration-300" />
                  <span className="hidden sm:inline text-xs font-bold text-amber-400">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-600 animate-in spin-in-90 duration-300" />
                  <span className="hidden sm:inline text-xs font-bold text-slate-700">Dark</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Tab 1: Invoice Generator / Creator */}
          {activeTab === 'generator' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Row: Company Details & Customer Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompanyDetailsForm company={company} onChange={handleCompanyChange} />
                <CustomerDetailsForm customer={customer} onChange={handleCustomerChange} />
              </div>

              {/* Row 2: Invoice Meta Details */}
              <InvoiceMetaForm
                meta={meta}
                onChange={handleMetaChange}
                onRegenerateInvoiceNumber={handleRegenerateInvoiceNumber}
              />

              {/* Row 3: Product Selector Table & Line Items */}
              <ProductSelectorTable
                items={items}
                presetProducts={presetProducts}
                currencySymbol={meta.currencySymbol}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
                onDuplicateItem={handleDuplicateItem}
                onOpenCatalogManager={() => setActiveTab('catalog')}
              />

              {/* Row 4: Bank Details, Terms & Financial Summary */}
              <InvoiceSummarySection
                summary={summary}
                currencySymbol={meta.currencySymbol}
                bankDetails={meta.bankDetails}
                notes={meta.notes}
                termsAndConditions={meta.termsAndConditions}
                onGlobalDiscountChange={(type, val) => {
                  setGlobalDiscountType(type);
                  setGlobalDiscountValue(val);
                }}
                onInterStateToggle={(interState) => setIsInterState(interState)}
                onBankDetailsChange={(field, val) => {
                  setMeta((prev) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, [field]: val },
                  }));
                }}
                onNotesChange={(n) => setMeta((prev) => ({ ...prev, notes: n }))}
                onTermsChange={(t) => setMeta((prev) => ({ ...prev, termsAndConditions: t }))}
                onGenerateInvoice={() => setIsPreviewOpen(true)}
                onSaveInvoice={handleSaveInvoice}
                onClearInvoice={() => setShowClearConfirm(true)}
              />
            </div>
          )}

          {/* Tab 2: Saved Invoices in MySQL */}
          {activeTab === 'saved' && (
            <div className="animate-in fade-in duration-150">
              <SavedInvoicesList
                invoices={savedInvoices}
                currencySymbol={meta.currencySymbol}
                onSelectInvoice={handleSelectInvoice}
                onPreviewInvoice={handlePreviewSpecificInvoice}
                onDuplicateInvoice={handleDuplicateInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                onUpdateStatus={handleUpdateStatus}
                onCreateNew={handleNewInvoice}
                isLoading={isLoadingInvoices}
              />
            </div>
          )}

          {/* Tab 3: Pre-configured Product Catalog */}
          {activeTab === 'catalog' && (
            <div className="animate-in fade-in duration-150">
              <ProductCatalogModal
                products={presetProducts}
                currencySymbol={meta.currencySymbol}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onResetDefaults={handleResetProductDefaults}
                isLoading={isLoadingProducts}
              />
            </div>
          )}

          {/* Tab 4: Company Profiles & Seller Registry */}
          {activeTab === 'companies' && (
            <div className="animate-in fade-in duration-150">
              <CompanyManagerModal
                companies={savedCompanies}
                activeCompany={company}
                onSelectActiveCompany={handleSelectActiveCompany}
                onAddCompany={handleAddCompany}
                onUpdateCompany={handleUpdateCompany}
                onDeleteCompany={handleDeleteCompany}
                isLoading={isLoadingCompanies}
              />
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal for Clearing Invoice Form */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => setShowClearConfirm(false)} />
          <div className="relative z-10 bg-white dark:bg-[#1C1C1C] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-[#333333] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Clear Invoice Form?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Are you sure you want to clear all current form fields, recipient information, and line items?
                </p>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start space-x-2">
                  <span>
                    <strong>Notice:</strong> This will reset the active form so you can start completely fresh with a new invoice number.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-[#282828] hover:bg-slate-200 dark:hover:bg-[#333333] rounded-lg transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearInvoice}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs cursor-pointer select-none flex items-center space-x-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear & Reset Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice PDF Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        company={company}
        customer={customer}
        meta={meta}
        items={items}
        summary={summary}
        onSaveToDatabase={handleSaveInvoice}
        isSaving={isSaving}
      />
    </div>
  );
}
