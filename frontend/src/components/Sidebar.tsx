import React, { useState } from 'react';
import {
  FileText,
  Database,
  Package,
  Building2,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'generator' | 'saved' | 'catalog' | 'companies';
  setActiveTab: (tab: 'generator' | 'saved' | 'catalog' | 'companies') => void;
  savedCount: number;
  companyCount: number;
  onPreviewInvoice: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  companyCount,
  onPreviewInvoice,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleTabClick = (tab: 'generator' | 'saved' | 'catalog' | 'companies') => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 select-none bg-[#F4F6F9] dark:bg-[#141414] transition-colors duration-200">
      {/* Top Brand & Menu Items */}
      <div className="space-y-6">
        {/* Brand Logo & Identity (Clickable to redirect to Create Invoice) */}
        <button
          id="sidebar-brand-logo-btn"
          type="button"
          onClick={() => handleTabClick('generator')}
          title="Go to Create Invoice"
          className="w-full text-left flex items-center space-x-3 pb-5 border-b border-slate-200 dark:border-[#282828] group cursor-pointer focus:outline-none transition-all"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0 group-hover:scale-105 group-hover:shadow-indigo-600/40 transition-transform">
            <div className="w-4 h-4 border-2 border-white transform rotate-45 shadow-xs"></div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white uppercase leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              E-Billing System
            </h1>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Billing
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded uppercase tracking-wider shadow-2xs">
                GST
              </span>
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-3 mb-2">
            Navigation Menu
          </span>

          <button
            id="sidebar-tab-generator"
            type="button"
            onClick={() => handleTabClick('generator')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#222222] hover:shadow-xs hover:translate-x-0.5'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileText className={`h-4 w-4 ${activeTab === 'generator' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Create Invoice</span>
            </div>
          </button>

          <button
            id="sidebar-tab-saved"
            type="button"
            onClick={() => handleTabClick('saved')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#222222] hover:shadow-xs hover:translate-x-0.5'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Database className={`h-4 w-4 ${activeTab === 'saved' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Saved Invoices</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-[#282828] text-slate-700 dark:text-slate-300'
              }`}
            >
              {savedCount}
            </span>
          </button>

          <button
            id="sidebar-tab-catalog"
            type="button"
            onClick={() => handleTabClick('catalog')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#222222] hover:shadow-xs hover:translate-x-0.5'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Package className={`h-4 w-4 ${activeTab === 'catalog' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Product Catalog</span>
            </div>
          </button>

          <button
            id="sidebar-tab-companies"
            type="button"
            onClick={() => handleTabClick('companies')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'companies'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-[#222222] hover:shadow-xs hover:translate-x-0.5'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Building2 className={`h-4 w-4 ${activeTab === 'companies' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Company Profiles</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                activeTab === 'companies' ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-[#282828] text-slate-700 dark:text-slate-300'
              }`}
            >
              {companyCount}
            </span>
          </button>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-slate-200 dark:border-[#282828]">
        <div className="p-3 bg-white dark:bg-[#1C1C1C] rounded-xl border border-slate-200 dark:border-[#2C2C2C] shadow-2xs flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-xs shadow-emerald-500/50"></div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
            <span className="text-slate-900 dark:text-white font-bold block">XAMPP MySQL</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">Connected 127.0.0.1:3306</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg Screen) */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-[#F4F6F9] dark:bg-[#141414] border-r border-slate-200 dark:border-[#282828] shrink-0 sticky top-0 h-screen overflow-y-auto z-40 shadow-sm transition-colors duration-200">
        {navContent}
      </aside>

      {/* Mobile Top Bar Header (Below lg Screen) */}
      <header className="lg:hidden h-14 bg-[#F4F6F9]/95 dark:bg-[#141414]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#282828] flex items-center justify-between px-4 sticky top-0 z-40 text-slate-900 dark:text-white select-none shadow-xs transition-colors duration-200">
        <button
          type="button"
          onClick={() => handleTabClick('generator')}
          title="Go to Create Invoice"
          className="flex items-center space-x-2.5 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
            <div className="w-3.5 h-3.5 border-2 border-white transform rotate-45"></div>
          </div>
          <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white uppercase">
            E-Billing System
          </span>
        </button>

        <div className="flex items-center space-x-2">
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-[#242424] transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          <button
            type="button"
            onClick={onPreviewInvoice}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-[#242424] transition-colors"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#F4F6F9] dark:bg-[#141414] shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-[#282828]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#282828]">
              <button
                type="button"
                onClick={() => handleTabClick('generator')}
                title="Go to Create Invoice"
                className="flex items-center space-x-2.5 cursor-pointer text-left focus:outline-none"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <div className="w-3.5 h-3.5 border-2 border-white transform rotate-45"></div>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">E-Billing System</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-[#242424]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
