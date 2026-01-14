
import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Product, InvoiceItem } from '../types';

interface InvoiceScannerProps {
  products: Product[];
  onUpdateStock: (updates: InvoiceItem[]) => void;
}

const InvoiceScanner: React.FC<InvoiceScannerProps> = ({ products, onUpdateStock }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<InvoiceItem[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setResults(null);
    }
  };

  const processInvoice = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    try {
      const base64Data = previewUrl.split(',')[1];
      const items = await geminiService.scanInvoice(base64Data);
      
      // Attempt fuzzy match with existing products
      const matchedItems = items.map(item => {
        const match = products.find(p => 
          p.name.toLowerCase().includes(item.itemName.toLowerCase()) || 
          item.itemName.toLowerCase().includes(p.name.toLowerCase())
        );
        return { ...item, matchedProductId: match?.id };
      });

      setResults(matchedItems);
    } catch (error) {
      console.error(error);
      alert("Failed to process invoice. Please check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMatch = (index: number, productId: string) => {
    if (!results) return;
    const newResults = [...results];
    newResults[index].matchedProductId = productId;
    setResults(newResults);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex p-4 rounded-3xl bg-indigo-50 text-indigo-600 mb-6">
          <Scan size={40} />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">AI Invoice Scanner</h2>
        <p className="text-gray-500 mt-2 text-lg">Upload an invoice and let Gemini automatically detect items and quantities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Upload size={20} className="text-indigo-600" />
            1. Upload Invoice
          </h3>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              flex-1 min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all
              ${previewUrl ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'}
            `}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-2xl shadow-lg" />
            ) : (
              <>
                <FileText size={48} className="text-gray-300 mb-4" />
                <p className="font-bold text-gray-900">Click to upload or drop file</p>
                <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="image/*"
            />
          </div>

          <button 
            disabled={!file || isProcessing}
            onClick={processInvoice}
            className={`
              mt-6 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
              ${isProcessing || !file ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing with Gemini AI...
              </>
            ) : (
              <>
                Analyze Invoice <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              2. Review Results
            </div>
            {results && (
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold">
                {results.length} ITEMS DETECTED
              </span>
            )}
          </h3>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {results ? results.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{item.itemName}</h4>
                  <span className="text-indigo-600 font-bold">qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <select 
                    className={`
                      flex-1 text-sm rounded-xl py-2 px-3 border-none shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none
                      ${item.matchedProductId ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-white text-gray-500'}
                    `}
                    value={item.matchedProductId || ''}
                    onChange={(e) => updateMatch(idx, e.target.value)}
                  >
                    <option value="">Unmatched - Select product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                    ))}
                  </select>
                  {item.matchedProductId && <Check size={18} className="text-emerald-500" />}
                </div>
                <p className="text-xs text-gray-400 mt-2">Unit Price: ${item.unitPrice}</p>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                <Loader2 size={40} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">Scan an invoice to see detected products here</p>
              </div>
            )}
          </div>

          <button 
            disabled={!results || results.length === 0}
            onClick={() => onUpdateStock(results || [])}
            className={`
              mt-6 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
              ${!results ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'}
            `}
          >
            Apply to Inventory <Check size={20} />
          </button>
        </div>
      </div>

      {results && results.some(r => !r.matchedProductId) && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-800">
          <AlertCircle className="shrink-0" size={20} />
          <p className="text-sm font-medium">Some items were not automatically matched to your catalog. Please map them manually before applying.</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceScanner;
