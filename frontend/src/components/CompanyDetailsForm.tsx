import React, { useRef } from 'react';
import { Building2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { CompanyDetails } from '../types';

interface CompanyDetailsFormProps {
  company: CompanyDetails;
  onChange: (field: keyof CompanyDetails, value: string) => void;
}

export const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ company, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange('companyLogo', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
      {/* Geometric Balanced Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/30 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Origin Details
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Company Information (Seller)
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label htmlFor="company-name-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="company-name-input"
              type="text"
              required
              value={company.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              placeholder="Enter company name (e.g. Acme Corp)"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold transition-all shadow-2xs"
            />
          </div>

          {/* Tagline / Subtitle */}
          <div className="md:col-span-2">
            <label htmlFor="company-tagline-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Tagline / Business Nature (Optional)
            </label>
            <input
              id="company-tagline-input"
              type="text"
              value={company.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="Enter tagline or business description"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Company Address */}
          <div className="md:col-span-2">
            <label htmlFor="company-address-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Company Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="company-address-input"
              rows={2}
              required
              value={company.companyAddress}
              onChange={(e) => onChange('companyAddress', e.target.value)}
              placeholder="Enter registered office address"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="company-phone-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="company-phone-input"
              type="text"
              value={company.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Enter contact phone number"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-mono"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="company-email-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="company-email-input"
              type="email"
              value={company.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="company@example.com"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* GST Number */}
          <div>
            <label htmlFor="company-gst-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              GSTIN / Tax ID <span className="text-rose-500">*</span>
            </label>
            <input
              id="company-gst-input"
              type="text"
              value={company.gstNumber}
              onChange={(e) => onChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="Enter 15-digit GSTIN / Tax ID"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono uppercase font-bold transition-all"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="company-website-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Website URL
            </label>
            <input
              id="company-website-input"
              type="url"
              value={company.website}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Company Logo Section */}
          <div className="md:col-span-2 pt-3 border-t border-slate-100 dark:border-[#282828]">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-2">
              Company Brand Logo
            </label>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Logo Preview box */}
              <div className="h-16 w-28 rounded border border-dashed border-slate-300 dark:border-[#383838] bg-slate-50 dark:bg-[#141414] flex items-center justify-center relative overflow-hidden shrink-0 group">
                {company.companyLogo ? (
                  <>
                    <img
                      src={company.companyLogo}
                      alt="Company Logo"
                      className="max-h-full max-w-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => onChange('companyLogo', '')}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove Logo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-slate-400 dark:text-slate-500">
                    <ImageIcon className="h-4 w-4 mx-auto" />
                    <span className="text-[9px] font-bold uppercase tracking-wider block mt-0.5">No Logo</span>
                  </div>
                )}
              </div>

              {/* Upload Button and URL input */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    id="logo-file-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#242424] hover:bg-slate-200 dark:hover:bg-[#2C2C2C] border border-slate-200 dark:border-[#383838] rounded flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                    <span>Upload Logo</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={company.companyLogo || ''}
                  onChange={(e) => onChange('companyLogo', e.target.value)}
                  placeholder="https://example.com/logo.png or image data URL"
                  className="w-full px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
