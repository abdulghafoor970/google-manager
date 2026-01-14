
import React, { useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  User as UserIcon,
  Tag
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = filterType === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  const getBadgeStyles = (type: TransactionType) => {
    switch (type) {
      case TransactionType.SALE: return 'bg-rose-50 text-rose-600 border-rose-100';
      case TransactionType.RESTOCK: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case TransactionType.INVOICE: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case TransactionType.ADD: return 'bg-sky-50 text-sky-600 border-sky-100';
      case TransactionType.ADJUSTMENT: return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    if (type === TransactionType.SALE) return <ArrowDownRight size={16} />;
    if (type === TransactionType.RESTOCK || type === TransactionType.ADD || type === TransactionType.INVOICE) return <ArrowUpRight size={16} />;
    return <RefreshCw size={16} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Transaction Logs</h2>
          <p className="text-gray-500 mt-1">Complete audit trail of inventory movements</p>
        </div>
        <div className="flex gap-2">
          {['ALL', ...Object.values(TransactionType)].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterType === type 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Change</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(t.timestamp).toLocaleDateString()}
                      <span className="text-gray-400 font-normal">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">{t.productName}</p>
                    <p className="text-xs text-gray-400">ID: {t.productId}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getBadgeStyles(t.type)}`}>
                      {getTypeIcon(t.type)}
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`text-center font-bold text-sm ${t.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon size={12} className="text-gray-400" />
                      </div>
                      {t.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-400 italic">"{t.notes || '-'}"</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <History size={48} className="mx-auto mb-4 opacity-10" />
              <p>No transaction history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
