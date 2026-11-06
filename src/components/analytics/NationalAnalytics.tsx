import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { PriceComparisonChart } from './PriceComparisonChart';
import { StatsCard } from '../common/StatsCard';
import { 
  LineChart, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Warehouse, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Scale, 
  Truck, 
  Users,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';

export const NationalAnalytics: React.FC = () => {
  const { alerts, resolveAlert, wilayaBalances, crops, contracts } = useMarket();

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031d14] via-[#052b1e] to-[#031710] border border-cyan-500/30 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-xs text-cyan-300 font-bold">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>المرصد الوطني لمراقبة الأسعار، الوفرة، ومكافحة المضاربة</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              لوحة المؤشرات والتحليلات السيادية للأمن الغذائي الوطني
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              رصد مستمر لمستويات الإنتاج، شفافية قنوات التوزيع، وقياس أثر قرارات التسقيف والشراء السيادي الفوري على حماية القدرة الشرائية للمواطن الجزائري.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 shrink-0">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-emerald-400"
                  fill="transparent"
                  strokeDasharray="213.6"
                  strokeDashoffset="11" // ~94.8%
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-black text-white font-mono">94.8%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">مؤشر كسر المضاربة</p>
              <p className="text-[11px] text-slate-400">انضباط صارم للسقف</p>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-1 inline-block">
                مستوى استقرار عالي
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign National KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="مؤشر محاربة المضاربة الوطني"
          value="94.8%"
          subtitle="نسبة تقيد الأسواق بالسقف"
          icon={<ShieldCheck className="w-6 h-6" />}
          accentColor="emerald"
          trend={{ value: '+14.2%', isPositive: true, label: 'منذ تفعيل التسقيف' }}
        />
        <StatsCard
          title="نسبة تغطية السوق المحلي"
          value="91.2%"
          subtitle="وفرة مستقرة بالمواد الأساسية"
          icon={<Activity className="w-6 h-6" />}
          accentColor="blue"
          trend={{ value: 'استقلالية استراتيجية', isPositive: true }}
        />
        <StatsCard
          title="انخفاض الأسعار بعد الضخ السيادي"
          value="-34.5%"
          subtitle="متوسط التخفيض لصالح المواطن"
          icon={<TrendingDown className="w-6 h-6" />}
          accentColor="gold"
          trend={{ value: 'حماية القدرة الشرائية', isPositive: true }}
        />
        <StatsCard
          title="إنذارات المضاربة المفتوحة"
          value={activeAlerts.length}
          subtitle={`${resolvedAlerts.length} إنذارات تمت معالجتها`}
          icon={<AlertTriangle className="w-6 h-6" />}
          accentColor={activeAlerts.length > 0 ? 'red' : 'emerald'}
          trend={{ value: 'تدخل ميداني 100%', isPositive: true }}
        />
      </div>

      {/* Main Visual: Price Comparison Chart */}
      <PriceComparisonChart />

      {/* Two Columns: Index Breakdown & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Anti-Speculation Index Breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>معايير قياس مؤشر محاربة المضاربة (المعدل 94.8%)</span>
            </h3>
            <span className="text-xs text-slate-400">تقييم المرصد الوطني</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Criteria 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">الامتثال التام للسقف السعري الإلزامي:</span>
                <span className="font-bold text-emerald-400 font-mono">97.2%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '97.2%' }} />
              </div>
            </div>

            {/* Criteria 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">حظر واختفاء الوسطاء غير المرخصين:</span>
                <span className="font-bold text-emerald-400 font-mono">93.5%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '93.5%' }} />
              </div>
            </div>

            {/* Criteria 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">سرعة الشراء والضخ السيادي المباشر:</span>
                <span className="font-bold text-amber-400 font-mono">96.0%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            {/* Criteria 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">الربط المباشر مع سجل الفلاح وبطاقة الحرفة:</span>
                <span className="font-bold text-cyan-400 font-mono">92.4%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '92.4%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 text-[11px] text-slate-400 flex items-center justify-between">
            <span>المرجع: قانون 15-21 المتعلق بمكافحة المضاربة غير المشروعة</span>
            <span className="text-emerald-400 font-semibold">محدث لحظياً</span>
          </div>
        </div>

        {/* Live Alerts & Whistleblower Feed */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>بلاغات وإنذارات الرقابة الميدانية ومكافحة الغش</span>
            </h3>
            <span className="text-xs bg-red-950/80 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold">
              {activeAlerts.length} إنذارات نشطة
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                  alert.resolved
                    ? 'bg-slate-900/40 border-slate-700/50 opacity-60'
                    : alert.severity === 'critical'
                      ? 'bg-red-950/40 border-red-500/40'
                      : 'bg-amber-950/40 border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${alert.resolved ? 'bg-slate-500' : 'bg-red-400 animate-ping'}`} />
                    <h4 className="font-bold text-white text-xs">{alert.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">الموقع: {alert.wilaya}</span>
                  {!alert.resolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تسوية وتأكيد التدخل</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تمت المعالجة والردع
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
