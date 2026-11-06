import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { ShieldCheck, TrendingDown, BellRing } from 'lucide-react';

export const PriceTicker: React.FC = () => {
  const { priceCeilings } = useMarket();

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-y border-emerald-500/20 py-2.5 px-4 overflow-hidden text-xs relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-2 bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-md border border-emerald-500/30 font-bold shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>النشرة اللحظية لأسقف المواد الفلاحية المقننة (مرسوم ضبط السوق)</span>
        </div>

        {/* Ticker items */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {priceCeilings.map((rule) => (
            <div 
              key={rule.id}
              className="flex items-center gap-2.5 bg-slate-900/80 px-3 py-1 rounded border border-emerald-500/20 shrink-0 hover:border-amber-400/40 transition-colors"
            >
              <span className="font-semibold text-slate-200">{rule.cropName}</span>
              <span className="text-amber-400 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                السقف: {rule.maxLegalPricePerKg} {rule.unit}
              </span>
              <span className="text-emerald-400 flex items-center gap-0.5 text-[11px]">
                <TrendingDown className="w-3 h-3" />
                الدعم: +{rule.supportSubsidyPerKg} دج
              </span>
            </div>
          ))}
        </div>

        {/* Legal Alert Note */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 shrink-0 text-[11px]">
          <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>البيع فوق السقف المذكور يعرض صاحبه لمتابعات بموجب قانون مكافحة المضاربة 15-21</span>
        </div>
      </div>
    </div>
  );
};
