
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Users, 
  Scan, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { User, Product, Transaction, UserRole, TransactionType, InvoiceItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_USERS } from './constants';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';
import InvoiceScanner from './pages/InvoiceScanner';

const App: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to Admin for demo
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'transactions' | 'users' | 'scanner'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Helpers
  const logTransaction = useCallback((
    productId: string, 
    productName: string, 
    type: TransactionType, 
    quantityChange: number, 
    notes?: string
  ) => {
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      productId,
      productName,
      type,
      quantityChange,
      userEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      notes
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, [currentUser]);

  const updateProductStock = (id: string, delta: number, type: TransactionType, notes?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, quantity: Math.max(0, p.quantity + delta), lastUpdated: new Date().toISOString() };
        logTransaction(id, p.name, type, delta, notes);
        return updated;
      }
      return p;
    }));
  };

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newId = `p-${Date.now()}`;
    const newProduct = { ...product, id: newId, lastUpdated: new Date().toISOString() };
    setProducts(prev => [...prev, newProduct]);
    logTransaction(newId, product.name, TransactionType.ADD, product.quantity, 'Product created');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Check for low stock alerts
  useEffect(() => {
    const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold);
    if (lowStockItems.length > 0) {
      setNotifications(lowStockItems.map(p => `Low stock alert: ${p.name} (${p.quantity} left)`));
    }
  }, [products]);

  const NavItem = ({ id, label, icon: Icon, roles }: { id: typeof activeTab, label: string, icon: any, roles: UserRole[] }) => {
    if (!roles.includes(currentUser.role)) return null;
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
          active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              OmniStock AI
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} roles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]} />
          <NavItem id="inventory" label="Inventory" icon={Package} roles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]} />
          <NavItem id="scanner" label="AI Invoice Scanner" icon={Scan} roles={[UserRole.ADMIN, UserRole.MANAGER]} />
          <NavItem id="transactions" label="Transactions" icon={History} roles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]} />
          <NavItem id="users" label="Team Management" icon={Users} roles={[UserRole.ADMIN]} />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 font-medium">{currentUser.role}</p>
            </div>
            <button 
              onClick={() => alert('Logout simulated')}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              products={products} 
              transactions={transactions} 
              onRestock={(id) => updateProductStock(id, 10, TransactionType.RESTOCK)}
            />
          )}
          {activeTab === 'inventory' && (
            <Inventory 
              products={products} 
              role={currentUser.role}
              onUpdateStock={updateProductStock}
              onAddProduct={addProduct}
              onDeleteProduct={deleteProduct}
            />
          )}
          {activeTab === 'scanner' && (
            <InvoiceScanner 
              products={products}
              onUpdateStock={(updates) => {
                updates.forEach(u => {
                  if (u.matchedProductId) {
                    updateProductStock(u.matchedProductId, u.quantity, TransactionType.INVOICE, `AI Invoice Scan: ${u.itemName}`);
                  }
                });
                setActiveTab('inventory');
              }}
            />
          )}
          {activeTab === 'transactions' && (
            <Transactions transactions={transactions} />
          )}
          {activeTab === 'users' && (
            <UserManagement users={users} onUpdateUserRole={(email, role) => setUsers(prev => prev.map(u => u.email === email ? { ...u, role } : u))} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
