
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  AlertCircle,
  Clock,
  ArrowRight,
  // Added missing icon imports
  Plus,
  CheckCircle2
} from 'lucide-react';
import { Product, Transaction } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  onRestock: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions, onRestock }) => {
  const totalStockValue = products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
  const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold);
  const outOfStockItems = products.filter(p => p.quantity === 0);

  const chartData = products.slice(0, 5).map(p => ({
    name: p.name,
    stock: p.quantity,
    threshold: p.lowStockThreshold
  }));

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{subtext}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Snapshot of your inventory performance</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-600">
          <Clock size={16} />
          Last sync: Today, 10:45 AM
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={products.length} 
          subtext="Active in catalog" 
          icon={Package} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Stock Value" 
          value={`$${totalStockValue.toLocaleString()}`} 
          subtext="Inventory assets" 
          icon={DollarSign} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Low Stock" 
          value={lowStockItems.length} 
          subtext="Needs attention" 
          icon={AlertCircle} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Out of Stock" 
          value={outOfStockItems.length} 
          subtext="Impacts sales" 
          icon={TrendingDown} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Stock Distribution</h3>
            <select className="bg-gray-50 border-none rounded-xl text-sm px-4 py-2 outline-none">
              <option>Top 5 Items</option>
              <option>Electronics</option>
              <option>Accessories</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stock <= entry.threshold ? '#f59e0b' : '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Action Required</h3>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">ALERTS</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {lowStockItems.length > 0 ? lowStockItems.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                    <p className="text-xs text-amber-600 font-semibold">{p.quantity} units left</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRestock(p.id)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Plus size={18} />
                </button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="text-emerald-600" size={32} />
                </div>
                <p className="text-gray-900 font-bold">All clear!</p>
                <p className="text-gray-500 text-sm">Stock levels are healthy</p>
              </div>
            )}
          </div>
          <button className="mt-6 flex items-center justify-center gap-2 text-indigo-600 font-bold text-sm py-3 border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-colors">
            View All Inventory <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
