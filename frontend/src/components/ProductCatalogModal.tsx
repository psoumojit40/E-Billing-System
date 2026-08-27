import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
} from 'lucide-react';
import { ProductItem } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ProductCatalogModalProps {
  products: ProductItem[];
  currencySymbol: string;
  onAddProduct: (product: Omit<ProductItem, 'id'>) => Promise<void>;
  onUpdateProduct?: (id: string, product: Partial<ProductItem>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onResetDefaults: () => void;
  isLoading?: boolean;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  products,
  currencySymbol,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaults,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(500);
  const [gstRate, setGstRate] = useState<number>(18);
  const [hsnCode, setHsnCode] = useState('');
  const [unit, setUnit] = useState('Pcs');
  const [stock, setStock] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSku('');
    setPrice(500);
    setGstRate(18);
    setHsnCode('');
    setUnit('Pcs');
    setStock(100);
    setEditingProductId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (prod: ProductItem) => {
    setEditingProductId(prod.id);
    setSku(prod.sku || '');
    setName(prod.name || '');
    setDescription(prod.description || '');
    setPrice(prod.price ?? 0);
    setGstRate(prod.gstRate ?? 18);
    setHsnCode(prod.hsnCode || '');
    setUnit(prod.unit || 'Pcs');
    setStock(prod.stock ?? 100);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '') return;

    setIsSubmitting(true);

    if (editingProductId && onUpdateProduct) {
      await onUpdateProduct(editingProductId, {
        sku: sku || `PROD${String(products.length + 1).padStart(3, '0')}`,
        name,
        description,
        price: Number(price),
        gstRate: Number(gstRate),
        hsnCode,
        unit,
        stock: Number(stock),
      });
    } else {
      await onAddProduct({
        sku: sku || `PROD${String(products.length + 1).padStart(3, '0')}`,
        name,
        description,
        price: Number(price),
        gstRate: Number(gstRate),
        hsnCode,
        unit,
        stock: Number(stock),
      });
    }

    resetForm();
    setIsSubmitting(false);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200/80 dark:border-[#2C2C2C] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Product Inventory Catalog
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-[#242424] dark:to-[#1E1E1E] text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-200/60 dark:border-[#383838] shadow-2xs uppercase tracking-wider">
                Live Inventory
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage product inventory items with pre-set unit prices and statutory GST rates
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#333333] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Reset Default Products
          </button>
          <button
            type="button"
            onClick={() => {
              if (showAddForm) {
                resetForm();
              } else {
                setEditingProductId(null);
                setShowAddForm(true);
              }
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'New Product'}</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Product Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-indigo-50/50 dark:bg-[#1C1C1C] rounded-xl border border-indigo-200 dark:border-[#333333] p-5 shadow-xs animate-in fade-in duration-150 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-[#2C2C2C]">
            <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
              {editingProductId ? 'Edit Product Details' : 'Add New Product To Catalog'}
            </h3>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              {editingProductId ? `Product ID: ${editingProductId}` : 'Standard Item'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="PROD004"
                className="w-full px-3 py-2 text-xs font-mono uppercase bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enterprise Solution Pack"
                className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pcs">Pieces (Pcs)</option>
                <option value="Units">Units</option>
                <option value="Lic">License (Lic)</option>
                <option value="Hrs">Hours (Hrs)</option>
                <option value="Sets">Sets</option>
                <option value="Yr">Yearly (Yr)</option>
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed technical specifications..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* HSN Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                HSN / SAC Code
              </label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="e.g. 8471"
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Price ({currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="500"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums"
              />
            </div>

            {/* GST Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GST Rate (%) <span className="text-rose-500">*</span>
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-[#141414] text-slate-900 dark:text-white border border-slate-300 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="0">0% (Exempt)</option>
                <option value="5">5% (Essential)</option>
                <option value="12">12% (Standard Low)</option>
                <option value="18">18% (Standard Enterprise)</option>
                <option value="28">28% (Luxury / Premium)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#252525] border border-slate-300 dark:border-[#383838] rounded-lg hover:bg-slate-50 dark:hover:bg-[#303030]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Saving...' : editingProductId ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Catalog Table */}
      <div className="bg-white dark:bg-[#181818] rounded-xl border border-slate-200 dark:border-[#2C2C2C] shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-[#282828] bg-slate-50/50 dark:bg-[#141414] flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by SKU, name, description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#1C1C1C] border border-slate-200 dark:border-[#383838] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {filtered.length} products available
          </span>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">Loading product catalog...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/90 dark:bg-[#141414] text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-[#2C2C2C]">
              <tr>
                <th className="py-3 px-4 w-28">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 w-20 text-center">HSN</th>
                <th className="py-3 px-4 w-24 text-right">Price</th>
                <th className="py-3 px-4 w-20 text-center">GST</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#262626] bg-white dark:bg-[#181818]">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 dark:hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#252525] rounded text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#383838]">
                      {prod.sku}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs truncate">
                    {prod.description || '—'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {prod.hsnCode || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(prod.price, currencySymbol)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 font-semibold text-[11px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-900/40">
                      {prod.gstRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(prod)}
                        title="Edit Product Details"
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(prod.id)}
                        title="Delete Product"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#252525] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
