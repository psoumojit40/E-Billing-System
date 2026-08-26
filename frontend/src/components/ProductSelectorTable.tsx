import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Copy,
} from 'lucide-react';
import { InvoiceItem, ProductItem } from '../types';
import { formatCurrency, calculateInvoiceItem } from '../utils/calculations';

interface ProductSelectorTableProps {
  items: InvoiceItem[];
  presetProducts: ProductItem[];
  currencySymbol: string;
  onAddItem: (product?: ProductItem) => void;
  onUpdateItem: (index: number, updated: Partial<InvoiceItem>) => void;
  onRemoveItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onOpenCatalogManager?: () => void;
}

export const ProductSelectorTable: React.FC<ProductSelectorTableProps> = ({
  items,
  presetProducts,
  currencySymbol,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onDuplicateItem,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const handleAddItemClick = () => {
    if (selectedPresetId) {
      const found = presetProducts.find((p) => p.id === selectedPresetId);
      if (found) {
        onAddItem(found);
      } else {
        onAddItem();
      }
    } else {
      onAddItem();
    }
    setSelectedPresetId('');
  };

  const handleFieldChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const current = items[index];
    const newPrice = field === 'price' ? Number(value) : current.price;
    const newQty = field === 'quantity' ? Number(value) : current.quantity;
    const newGst = field === 'gstRate' ? Number(value) : current.gstRate;
    const newDisc =
      field === 'discountPercent'
        ? Number(value)
        : current.discountPercent || 0;

    const calc = calculateInvoiceItem(newPrice, newQty, newGst, newDisc);

    onUpdateItem(index, {
      [field]: value,
      taxableAmount: calc.taxableAmount,
      gstAmount: calc.gstAmount,
      total: calc.total,
    });
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      {/* Geometric Balanced Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#282828] bg-gradient-to-r from-slate-50/90 via-white to-purple-50/20 dark:from-[#1E1E1E] dark:via-[#181818] dark:to-[#1E1E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Line Items
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-[#242424] dark:to-[#1E1E1E] text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-200/60 dark:border-[#383838] shadow-2xs">
                {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
              </span>
            </div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Product & Service Inventory
            </h2>
          </div>
        </div>

        {/* Action Controls & Preset Dropdown */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          {/* Preset Selector Dropdown */}
          <div className="relative flex-1 sm:w-64 min-w-[180px]">
            <select
              id="preset-product-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer select-none shadow-2xs"
            >
              <option value="" className="bg-white dark:bg-[#1E1E1E] text-slate-800 dark:text-slate-200">+ SELECT PRE-SET PRODUCT...</option>
              {presetProducts.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#1E1E1E] text-slate-800 dark:text-slate-200">
                  {p.name} ({p.sku}) — {formatCurrency(p.price, currencySymbol)} (+{p.gstRate}% GST)
                </option>
              ))}
            </select>
          </div>

          {/* Add Item Button */}
          <button
            id="add-product-btn"
            type="button"
            onClick={handleAddItemClick}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-[#2A2A2A] dark:via-[#222222] dark:to-[#181818] hover:from-slate-800 hover:to-indigo-900 rounded-lg transition-all shadow-sm shadow-slate-900/20 cursor-pointer select-none shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="p-3 sm:p-5">
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-[#333333] rounded bg-slate-50/50 dark:bg-[#141414]">
            <Package className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">No products added yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 max-w-sm mx-auto">
              Select pre-set products from your catalog or click Add Item below.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => onAddItem()}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-[#2A2A2A] hover:bg-slate-800 dark:hover:bg-[#333333] rounded transition-colors shadow-xs cursor-pointer select-none"
              >
                + Blank Item
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-slate-200 dark:border-[#2C2C2C]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-[#141414] text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#2C2C2C]">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center text-slate-400 dark:text-slate-500">#</th>
                  <th className="py-2.5 px-3 min-w-[180px]">
                    <span className="hidden sm:inline">Product / Service Description</span>
                    <span className="sm:hidden">Item & Description</span>
                  </th>
                  <th className="py-2.5 px-3 w-24">HSN / SKU</th>
                  <th className="py-2.5 px-3 w-18 text-center">Qty</th>
                  <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 w-20 text-center">GST %</th>
                  <th className="py-2.5 px-3 w-18 text-center">Disc %</th>
                  <th className="py-2.5 px-3 w-24 text-right">Taxable</th>
                  <th className="py-2.5 px-3 w-20 text-right">GST</th>
                  <th className="py-2.5 px-3 w-28 text-right">Total</th>
                  <th className="py-2.5 px-2 w-14 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#262626] bg-white dark:bg-[#181818]">
                {items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/60 dark:hover:bg-[#202020] transition-colors">
                    {/* Row Number */}
                    <td className="py-2 px-3 text-center text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    {/* Product Name & Description */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        placeholder="Product / Service Name"
                        className="w-full px-2 py-1 text-xs font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] focus:border-indigo-600 rounded focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                        placeholder="Add description / specifications..."
                        className="w-full px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-[#1E1E1E] focus:bg-white dark:focus:bg-[#242424] border border-transparent focus:border-slate-300 dark:focus:border-[#383838] rounded focus:outline-none transition-all mt-1"
                      />
                    </td>

                    {/* HSN / SKU */}
                    <td className="py-2 px-3 space-y-1">
                      <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => handleFieldChange(index, 'sku', e.target.value)}
                        placeholder="SKU"
                        className="w-full px-2 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:border-indigo-600"
                      />
                      <input
                        type="text"
                        value={item.hsnCode || ''}
                        onChange={(e) => handleFieldChange(index, 'hsnCode', e.target.value)}
                        placeholder="HSN/SAC"
                        className="w-full px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-transparent hover:bg-white dark:hover:bg-[#242424] border border-transparent focus:border-slate-300 dark:focus:border-[#383838] rounded focus:outline-none"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleFieldChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 text-xs text-center font-bold font-mono text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:border-indigo-600 tabular-nums"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleFieldChange(index, 'price', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-24 px-2 py-1 text-xs text-right font-mono font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#1E1E1E] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:border-indigo-600 tabular-nums"
                      />
                    </td>

                    {/* GST Rate (%) */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={item.gstRate}
                        onChange={(e) => handleFieldChange(index, 'gstRate', parseFloat(e.target.value))}
                        className="w-18 px-1.5 py-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-[#1E1E1E] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:border-indigo-600 cursor-pointer select-none"
                      >
                        <option value="0" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">0%</option>
                        <option value="5" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">5%</option>
                        <option value="12" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">12%</option>
                        <option value="18" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">18%</option>
                        <option value="28" className="bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white">28%</option>
                      </select>
                    </td>

                    {/* Discount (%) */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={item.discountPercent || 0}
                        onChange={(e) => handleFieldChange(index, 'discountPercent', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-14 px-1.5 py-1 text-xs text-center font-mono text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-[#1E1E1E] focus:bg-white dark:focus:bg-[#242424] border border-slate-200 dark:border-[#383838] rounded focus:outline-none focus:border-indigo-600 tabular-nums"
                      />
                    </td>

                    {/* Taxable Amount */}
                    <td className="py-2 px-3 text-right font-mono text-xs text-slate-700 dark:text-slate-300 tabular-nums font-bold">
                      {formatCurrency(item.taxableAmount, currencySymbol)}
                    </td>

                    {/* GST Amount */}
                    <td className="py-2 px-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      {formatCurrency(item.gstAmount, currencySymbol)}
                    </td>

                    {/* Line Total */}
                    <td className="py-2 px-3 text-right font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(item.total, currencySymbol)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateItem(index)}
                          title="Duplicate line item"
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#242424] rounded transition-colors select-none cursor-pointer"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          title="Remove product"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#242424] rounded transition-colors select-none cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
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
