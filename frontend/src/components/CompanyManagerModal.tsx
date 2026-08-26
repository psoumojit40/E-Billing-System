import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Upload,
} from 'lucide-react';
import { CompanyDetails, SavedCompany } from '../types';

interface CompanyManagerModalProps {
  companies: SavedCompany[];
  activeCompany?: CompanyDetails;
  onSelectActiveCompany: (company: CompanyDetails) => void;
  onAddCompany: (company: SavedCompany) => void;
  onUpdateCompany: (id: string, company: Partial<SavedCompany>) => void;
  onDeleteCompany: (id: string) => void;
}

export const CompanyManagerModal: React.FC<CompanyManagerModalProps> = ({
  companies,
  onSelectActiveCompany,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
}) => {
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SavedCompany, 'id'>>({
    companyName: '',
    tagline: '',
    companyAddress: '',
    phone: '',
    email: '',
    gstNumber: '',
    website: '',
    companyLogo: '',
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, companyLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (company: SavedCompany) => {
    setEditingCompanyId(company.id);
    setFormData({
      companyName: company.companyName,
      tagline: company.tagline || '',
      companyAddress: company.companyAddress,
      phone: company.phone,
      email: company.email,
      gstNumber: company.gstNumber,
      website: company.website,
      companyLogo: company.companyLogo,
    });
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);
    setFormData({
      companyName: '',
      tagline: '',
      companyAddress: '',
      phone: '',
      email: '',
      gstNumber: '',
      website: '',
      companyLogo: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.companyAddress || !formData.phone || !formData.email || !formData.gstNumber) {
      alert('Please fill out all required company fields (*)');
      return;
    }

    if (editingCompanyId) {
      onUpdateCompany(editingCompanyId, formData);
      handleCancelEdit();
    } else {
      const newComp: SavedCompany = {
        ...formData,
        id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      onAddCompany(newComp);
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Seller Company Profiles & Registry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add and manage your organization seller profiles stored in MySQL database.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-[10px] font-mono font-bold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-[#242424] dark:to-[#1E1E1E] text-indigo-700 dark:text-indigo-400 rounded-lg border border-indigo-200/60 dark:border-[#383838] uppercase tracking-wider shadow-2xs">
            {companies.length} Saved Profiles
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/30 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Plus className="h-3.5 w-3.5" />
              </div>
              <span>{editingCompanyId ? 'Edit Seller Company Profile' : 'Add New Seller Company Profile'}</span>
            </h3>
            {editingCompanyId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 uppercase tracking-wider cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Company Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name (e.g. Acme Corp)"
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Tagline / Business Nature (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Enter tagline or business description"
                  className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                Company Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                placeholder="Enter registered office address"
                className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter contact phone number"
                  className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="company@example.com"
                  className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* GSTIN & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  GSTIN / Tax ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  placeholder="Enter 15-digit GSTIN / Tax ID"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Company Brand Logo */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1.5">
                Company Brand Logo
              </label>
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-slate-100 dark:bg-[#141414] rounded border border-slate-200 dark:border-[#383838] overflow-hidden flex items-center justify-center shrink-0">
                  {formData.companyLogo ? (
                    <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="px-3 py-1.5 bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#303030] text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded border border-slate-200 dark:border-[#383838] cursor-pointer flex items-center space-x-1.5 select-none">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Logo</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#282828] flex items-center justify-end space-x-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none"
              >
                {editingCompanyId ? 'Update Company Profile' : 'Add New Company'}
              </button>
            </div>
          </form>
        </div>

        {/* Saved Companies List Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all overflow-hidden relative">
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-purple-50/20 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <span>Saved Company Profiles</span>
              </h3>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {companies.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-wider">No company profiles stored yet</p>
                </div>
              ) : (
                companies.map((comp) => {
                  return (
                    <div
                      key={comp.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-[#2C2C2C] bg-white dark:bg-[#1C1C1C] hover:border-slate-300 dark:hover:border-[#383838] transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={comp.companyLogo}
                            alt={comp.companyName}
                            className="w-10 h-10 rounded border border-slate-200 dark:border-[#383838] object-cover shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{comp.companyName}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{comp.tagline}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditClick(comp)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#252525] rounded"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCompany(comp.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#252525] rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 font-mono">
                        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{comp.companyAddress}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="bg-slate-100 dark:bg-[#252525] px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#383838]">
                            GSTIN: {comp.gstNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{comp.phone}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#282828] flex justify-end">
                        <button
                          type="button"
                          onClick={() => onSelectActiveCompany(comp)}
                          className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 transition-all select-none cursor-pointer"
                        >
                          Use on Active Invoice
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
