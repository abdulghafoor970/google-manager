
import { User, Product, UserRole, Transaction, TransactionType } from './types';

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Alex Admin', email: 'admin@omnistock.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100' },
  { id: '2', name: 'Sarah Manager', email: 'sarah@omnistock.com', role: UserRole.MANAGER, avatar: 'https://picsum.photos/seed/manager/100' },
  { id: '3', name: 'John User', email: 'john@omnistock.com', role: UserRole.USER, avatar: 'https://picsum.photos/seed/user/100' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'LAP-PRO-14',
    name: 'MacBook Pro 14"',
    category: 'Electronics',
    costPrice: 1500,
    sellingPrice: 1999,
    quantity: 12,
    lowStockThreshold: 5,
    supplier: 'Apple Inc.',
    imageUrl: 'https://picsum.photos/seed/macbook/400/300',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'p2',
    sku: 'MOU-BT-X',
    name: 'Wireless Mouse X',
    category: 'Accessories',
    costPrice: 20,
    sellingPrice: 45,
    quantity: 3,
    lowStockThreshold: 10,
    supplier: 'Logitech',
    imageUrl: 'https://picsum.photos/seed/mouse/400/300',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'p3',
    sku: 'KB-MECH-G',
    name: 'Mechanical Gaming Keyboard',
    category: 'Accessories',
    costPrice: 60,
    sellingPrice: 120,
    quantity: 25,
    lowStockThreshold: 8,
    supplier: 'Razer',
    imageUrl: 'https://picsum.photos/seed/keyboard/400/300',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'p4',
    sku: 'MON-4K-27',
    name: '4K 27" Ultra Monitor',
    category: 'Electronics',
    costPrice: 300,
    sellingPrice: 499,
    quantity: 2,
    lowStockThreshold: 5,
    supplier: 'Dell',
    imageUrl: 'https://picsum.photos/seed/monitor/400/300',
    lastUpdated: new Date().toISOString()
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    productId: 'p1',
    productName: 'MacBook Pro 14"',
    type: TransactionType.RESTOCK,
    quantityChange: 5,
    userEmail: 'sarah@omnistock.com',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Initial restock'
  },
  {
    id: 't2',
    productId: 'p2',
    productName: 'Wireless Mouse X',
    type: TransactionType.SALE,
    quantityChange: -2,
    userEmail: 'john@omnistock.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    notes: 'In-store sale'
  }
];

export const APP_CONFIG = {
  CURRENCY: '$',
  TAX_RATE: 0.08
};
