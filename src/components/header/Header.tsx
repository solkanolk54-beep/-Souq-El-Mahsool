import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { Role } from '../../types';
import { 
  Tractor, 
  Truck, 
  Landmark, 
  LineChart, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  Scale,
  Sparkles,
  ShieldAlert,
  Database
} from 'lucide-react';

interface HeaderProps {
  onOpenReportModal: () => void;
  onOpenContractsList: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReportModal, onOpenContractsList }) => {
  const { role, setRole, alerts, contracts, resetData, crops, violations } = useMarket();

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const availableCropsCount = crops.filter(c => c.status === 'available').length;
  const unresolvedViolationsCount = violations.filter(v => v.status === 'unresolved').length;

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string; desc: string }[] = [
    {
      id: 'farmer',
      label: 'بوابة الفلاح المنتِج',
      icon: <Tractor className="w-5 h-5 text-emerald-400" />,
      desc: 'عرض المحاصيل، ضبط التكاليف، عقود التوريد',
    },
    {
      id: 'wholesaler',
      label: 'تاجر الجملة الخواص',
      icon: <Truck className="w-5 h-5 text-amber-400" />,
      badge: availableCropsCount > 0 ? `${availableCropsCount} متاح` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'سوق الجملة المباشر وعقود الشراء المقننة',
    },
    {
      id: 'state',
      label: 'النافذة السيادية للدولة والتعاونيات',
      icon: <Landmark className="w-5 h-5 text-yellow-400" />,
      badge: 'تدخل فوري',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'تسقيف الأسعار والشراء المباشر الفوري لمخزون الأمان',
    },
    {
      id: 'control_room',
      label: 'غرفة العمليات وقاعدة البيانات (PostgreSQL)',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      badge: unresolvedViolationsCount > 0 ? `${unresolvedViolationsCount} مضاربة` : undefined,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
      desc: 'الرصد اللحظي للأسقف ومخطط قاعدة البيانات',
    },
    {
      id: 'analytics',
      label: 'المرصد الوطني للمؤشرات',
      icon: <LineChart className="w-5 h-5 text-cyan-400" />,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} إنذارات` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'تحليلات الأسواق ومؤشرات وفرة المنتجات',
    },
  ];

  return (
    <header className="border-b border-emerald-500/20 bg-gradient-to-b from-[#041a13] via-[#051c14] to-[#041610] sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      {/* Top Sovereign Bar */}
      <div className="border-b border-emerald-500/15 py-2 px-4 bg-emerald-950/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Official Emblem & Institution */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-900/80 border border-amber-400/50 shadow-inner">
              <span className="text-amber-400 font-serif text-sm">🇩🇿</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</span>
              <span className="text-emerald-300 text-[11px]">وزارة الفلاحة والتنمية الريفية | الديوان الوطني لضبط الإنتاج الفلاحي ومكافحة المضاربة</span>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 transition-all text-xs font-semibold shadow-sm group"
              title="تبليغ فوري عن رفع غير قانوني للأسعار أو احتكار"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
              <span>التبليغ عن مضاربة (1020)</span>
            </button>

            <button
              onClick={onOpenContractsList}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 transition-all text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>سجل العقود المعتمدة ({contracts.length})</span>
            </button>

            <button
              onClick={resetData}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all text-xs hover:text-white"
              title="استعادة البيانات التجريبية الافتراضية"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>إعادة الضبط</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Role Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 border-2 border-amber-400/60 flex items-center justify-center shadow-lg gold-glow">
                <Scale className="w-6 h-6 text-amber-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-emerald-950">
                سيادي
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>سوق المحصول</span>
                  <span className="text-xs font-normal text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Souq El Mahsool
                  </span>
                </h1>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">
                المنظومة الوطنية الرقمية لضبط وتسقيف الأسعار الزراعية والربط المباشر بين الفلاح والأسواق
              </p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-emerald-500/20 overflow-x-auto no-scrollbar shadow-inner">
            {rolesConfig.map((item) => {
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-800/90 to-emerald-700 text-white shadow-md border border-amber-400/40 gold-glow'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
