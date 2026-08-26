import React from 'react';
import { User, Truck, CheckSquare, Square } from 'lucide-react';
import { CustomerDetails } from '../types';

interface CustomerDetailsFormProps {
  customer: CustomerDetails;
  onChange: (field: keyof CustomerDetails, value: any) => void;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ customer, onChange }) => {
  const handleSameAsBillingToggle = () => {
    const nextVal = !customer.sameAsBilling;
    onChange('sameAsBilling', nextVal);
    if (nextVal) {
      onChange('shippingAddress', customer.billingAddress);
    }
  };

  const handleBillingAddressChange = (val: string) => {
    onChange('billingAddress', val);
    if (customer.sameAsBilling) {
      onChange('shippingAddress', val);
    }
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>
      {/* Geometric Balanced Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-emerald-50/30 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Recipient Details
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Customer & Billing Information
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="md:col-span-2">
            <label htmlFor="customer-name-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Customer / Client Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-name-input"
              type="text"
              required
              value={customer.customerName}
              onChange={(e) => onChange('customerName', e.target.value)}
              placeholder="Enter customer / client name"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all shadow-2xs"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label htmlFor="customer-email-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Customer Billing Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-email-input"
              type="email"
              required
              value={customer.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label htmlFor="customer-phone-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Phone / Contact Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-phone-input"
              type="text"
              required
              value={customer.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Enter customer phone number"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-mono"
            />
          </div>

          {/* Customer GSTIN */}
          <div>
            <label htmlFor="customer-gst-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Customer GSTIN / Tax ID <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-gst-input"
              type="text"
              required
              value={customer.gstNumber}
              onChange={(e) => onChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="Enter customer GSTIN / Tax ID"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-mono uppercase font-bold transition-all"
            />
          </div>

          {/* Place of Supply */}
          <div>
            <label htmlFor="customer-place-of-supply" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Place of Supply / State <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-place-of-supply"
              type="text"
              required
              value={customer.placeOfSupply || ''}
              onChange={(e) => onChange('placeOfSupply', e.target.value)}
              placeholder="Enter state / place of supply"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Billing Address */}
          <div className="md:col-span-2">
            <label htmlFor="customer-billing-address-input" className="block text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
              Billing Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="customer-billing-address-input"
              rows={2}
              required
              value={customer.billingAddress}
              onChange={(e) => handleBillingAddressChange(e.target.value)}
              placeholder="Enter customer billing address"
              className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Shipping Address Header & Same As Billing Checkbox */}
          <div className="md:col-span-2 pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="customer-shipping-address-input" className="text-[10px] font-bold text-slate-500 dark:text-[#9E9E9E] uppercase tracking-wider flex items-center space-x-1.5">
                <Truck className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                <span>Shipping / Dispatch Destination</span>
              </label>
              <button
                type="button"
                onClick={handleSameAsBillingToggle}
                className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold uppercase tracking-wider cursor-pointer"
              >
                {customer.sameAsBilling ? (
                  <CheckSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Square className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                )}
                <span>Same as billing address</span>
              </button>
            </div>

            {!customer.sameAsBilling && (
              <div className="mt-1">
                <textarea
                  id="customer-shipping-address-input"
                  rows={2}
                  value={customer.shippingAddress}
                  onChange={(e) => onChange('shippingAddress', e.target.value)}
                  placeholder="Shipping destination / Warehouse address"
                  className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] rounded focus:bg-white dark:focus:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
