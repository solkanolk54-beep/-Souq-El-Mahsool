import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
        }[toast.type];

        const bg = {
          success: 'bg-[#042417] border-emerald-500/50 text-emerald-100',
          warning: 'bg-[#291e05] border-amber-500/50 text-amber-100',
          error: 'bg-[#290808] border-red-500/50 text-red-100',
          info: 'bg-[#041d24] border-cyan-500/50 text-cyan-100',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md pointer-events-auto flex items-start justify-between gap-3 text-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${bg}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div className="space-y-0.5">
                <h4 className="font-bold text-white text-xs">{toast.title}</h4>
                <p className="text-[11px] opacity-90 leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
