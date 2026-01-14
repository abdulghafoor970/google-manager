
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  supplier: string;
  imageUrl?: string;
  lastUpdated: string;
}

export enum TransactionType {
  ADD = 'ADD',
  SALE = 'SALE',
  RESTOCK = 'RESTOCK',
  ADJUSTMENT = 'ADJUSTMENT',
  INVOICE = 'INVOICE'
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
  quantityChange: number;
  userEmail: string;
  timestamp: string;
  notes?: string;
}

export interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  matchedProductId?: string;
}

export interface SystemSettings {
  defaultLowStockThreshold: number;
  currency: string;
}
