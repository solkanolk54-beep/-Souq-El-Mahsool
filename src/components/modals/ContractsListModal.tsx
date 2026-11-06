import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { OfficialContract } from '../../types';
import { 
  X, 
  FileText, 
  Landmark, 
  Truck, 
  Printer, 
  Calendar, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

interface ContractsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContract: (contract: OfficialContract) => void;
}

export const ContractsListModal: React.FC<ContractsListModalProps> = ({ isOpen, onClose, onSelectContract }) => {
  const { contracts } = useMarket();
  const [filterType, setFilterType] = useState<'all' | 'state' | 'wholesaler'>('all');

  if (!isOpen) return null;

  const filtered = contracts.filter(c => {
    if (filterType === 'state' && c.buyerType !== 'state') return false;
    if (filterType === 'wholesaler' && c.buyerType !== 'wholesaler') return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#06241a] to-[#04150f] rounded-2xl border border-emerald-500/30 shadow-2xl p-6 my-8 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                السجل الوطني للعقود وسندات الشحن الفلاحي المعتمدة
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  {contracts.length} عقود مقننة
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                قاعدة بيانات التداولات الرسمية وسندات الشحن الصادرة تحت إشراف وزارة الفلاحة والتجارة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-950 text-slate-400 hover:text-white border border-emerald-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 my-4 bg-slate-950/70 p-2 rounded-xl border border-emerald-500/15">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            جميع العقود ({contracts.length})
          </button>
          <button
            onClick={() => setFilterType('state')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'state'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            عقود الشراء السيادي للدولة ({contracts.filter(c => c.buyerType === 'state').length})
          </button>
          <button
            onClick={() => setFilterType('wholesaler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'wholesaler'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            عقود تجار الجملة الخواص ({contracts.filter(c => c.buyerType === 'wholesaler').length})
          </button>
        </div>

        {/* List of Contracts */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filtered.map((contract) => {
            const isState = contract.buyerType === 'state';

            return (
              <div
                key={contract.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 hover:border-amber-400/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isState
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isState ? 'شراء سيادي' : 'شراء جملة مقنن'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{contract.contractNumber}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{contract.contractDate}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{contract.cropTitle}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-[11px]">
                    <span>الفلاح: <strong className="text-slate-100">{contract.sellerFarmerName}</strong></span>
                    <span>الجهة المشترية: <strong className="text-amber-300">{contract.buyerName}</strong></span>
                    <span>الكمية: <strong className="font-mono text-emerald-400">{contract.quantityTons} طن</strong></span>
                    <span>السعر: <strong className="font-mono text-white">{contract.pricePerKg} د.ج/كغ</strong></span>
                    <span>المبلغ: <strong className="font-mono text-amber-400">{contract.totalAmountDZD.toLocaleString()} د.ج</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectContract(contract);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>معاينة وطباعة السند</span>
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              لا توجد عقود تطابق هذا التصنيف
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-emerald-500/20 flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
