
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  Edit2,
  Trash2,
  Box,
  Image as ImageIcon,
  Tag,
  DollarSign,
  BarChart3,
  // Added missing X icon import
  X
} from 'lucide-react';
import { Product, UserRole, TransactionType } from '../types';

interface InventoryProps {
  products: Product[];
  role: UserRole;
  onUpdateStock: (id: string, delta: number, type: TransactionType) => void;
  onAddProduct: (p: any) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, role, onUpdateStock, onAddProduct, onDeleteProduct }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Inventory Catalog</h2>
          <p className="text-gray-500 mt-1">Manage and track your physical stock</p>
        </div>
        {(role === UserRole.ADMIN || role === UserRole.MANAGER) && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add New Product
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, SKU or brand..." 
            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="appearance-none bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none shadow-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">In Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-sm border border-white">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{product.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{product.sku}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">{product.category}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-bold ${product.quantity <= product.lowStockThreshold ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.quantity}
                      </span>
                      {product.quantity <= product.lowStockThreshold && (
                        <span className="text-[10px] font-bold text-amber-500 uppercase">Low Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">${product.sellingPrice}</p>
                    <p className="text-xs text-gray-400">Cost: ${product.costPrice}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(role === UserRole.ADMIN || role === UserRole.MANAGER) && (
                        <>
                          <button 
                            onClick={() => onUpdateStock(product.id, -1, TransactionType.SALE)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <ArrowDownRight size={18} />
                          </button>
                          <button 
                            onClick={() => onUpdateStock(product.id, 1, TransactionType.RESTOCK)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          >
                            <ArrowUpRight size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Box size={48} className="mb-4 text-gray-200" />
              <p className="font-medium text-lg text-gray-500">No products found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddProduct({
                  name: formData.get('name'),
                  sku: formData.get('sku'),
                  category: formData.get('category'),
                  costPrice: Number(formData.get('cost')),
                  sellingPrice: Number(formData.get('price')),
                  quantity: Number(formData.get('stock')),
                  lowStockThreshold: 5,
                  supplier: formData.get('supplier'),
                  imageUrl: `https://picsum.photos/seed/${formData.get('name')}/400/300`
                });
                setIsAddModalOpen(false);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                    <input name="name" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">SKU</label>
                    <input name="sku" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <input name="category" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cost Price</label>
                    <input name="cost" type="number" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price</label>
                    <input name="price" type="number" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
                    <input name="stock" type="number" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Supplier</label>
                    <input name="supplier" required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
