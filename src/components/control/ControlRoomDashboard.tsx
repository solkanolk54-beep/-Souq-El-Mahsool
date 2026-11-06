import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Radio, 
  AlertTriangle, 
  Zap, 
  Play, 
  Lock, 
  Search, 
  Gavel, 
  CheckCircle2, 
  Scale, 
  Database,
  Building,
  Terminal,
  Activity
} from 'lucide-react';
import { DatabaseSchemaViewer } from './DatabaseSchemaViewer';
import { ACIDSimulator } from './ACIDSimulator';

export const ControlRoomDashboard: React.FC = () => {
  const { 
    violations, 
    isAuthorityRoomConnected, 
    isSoundAlertEnabled, 
    toggleSoundAlert, 
    freezeUserAccount, 
    investigateAlert, 
    penalizeAlert, 
    executeACIDSimulation,
    crops
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'live_alerts' | 'acid_engine' | 'schema_erd'>('live_alerts');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const unresolvedViolationsCount = violations.filter(v => v.status === 'unresolved').length;

  // Simulator Triggers
  const handleSimulatePotatoSpeculation = () => {
    executeACIDSimulation(
      'crop-101',
      'مجمع الأطلس للتوزيع وسوق الجملة الكاليتوس',
      25,
      85, // Ceiling is 65 DZD -> Breach!
      true,
      'الجزائر العاصمة (16)'
    );
  };

  const handleSimulateTomatoSpeculation = () => {
    executeACIDSimulation(
      'crop-102',
      'مؤسسة التاج للتجارة السريعة',
      15,
      78, // Ceiling is 55 DZD -> Breach!
      true,
      'مستغانم (27)'
    );
  };

  const handleSimulateUnderFloor = () => {
    executeACIDSimulation(
      'crop-102',
      'وسيط خاص غير معتمد',
      10,
      25, // Floor is 35 DZD -> Farmer undercut breach!
      true,
      'عين تادلس (27)'
    );
  };

  const handleSimulateCompliantTrade = () => {
    executeACIDSimulation(
      'crop-101',
      'الشركة الوطنية لتسويق الخضر (ناشيونال خضر)',
      20,
      52, // Under ceiling 65 DZD -> Compliant COMMIT!
      true,
      'الوادي (39)'
    );
  };

  const filteredViolations = violations.filter(v => {
    if (filterStatus === 'unresolved') return v.status === 'unresolved';
    if (filterStatus === 'frozen') return v.status === 'frozen';
    if (filterStatus === 'investigated') return v.status === 'investigated';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Control Room Sovereign Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#200505] via-[#150404] to-[#0a1811] border-2 border-red-500/50 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full text-xs text-red-300 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>غرفة العمليات المركزية وضبط الأسعار السيادية (PostgreSQL + Socket.io)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              نظام التنبيه المبكر والرصد اللحظي لمخالفات المضاربة
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              اتصال مباشر بغرفة المراقبة والضبط (<code className="text-amber-400 font-mono text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-700">authorities_room</code>)، مع محرك التحقق الصارم من السقف السعري ومعاملات <strong className="text-emerald-400">ACID Transactions</strong> في قاعدة بيانات PostgreSQL لمنع أي تلاعب وتجميد المخالفين فورياً.
            </p>
          </div>

          {/* Status & Sound Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Real-time Room Badge */}
            <div className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Radio className="w-4 h-4 text-amber-400" />
              <span>متصل بالغرفة الرقابية</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSoundAlert}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isSoundAlertEnabled
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 hover:bg-amber-400/30'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="تفعيل أو كتم صافرة التنبيه عند رصد محاولة مضاربة"
            >
              {isSoundAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isSoundAlertEnabled ? 'صافرة الإنذار مفعّلة' : 'الصافرة مكتومة'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-red-500/20 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('live_alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'live_alerts'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-red-950/40'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>التنبيهات اللحظية الحية ({violations.length})</span>
            {unresolvedViolationsCount > 0 && (
              <span className="bg-red-950 text-red-200 border border-red-400 px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                {unresolvedViolationsCount} جديد
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('acid_engine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'acid_engine'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>محرك المعاملات الآمنة (ACID Engine Sandbox)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema_erd')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schema_erd'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'text-slate-300 hover:text-white hover:bg-amber-950/40'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>مخطط قاعدة البيانات (PostgreSQL DDL & ERD)</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Live Alerts & Instant Enforcement */}
      {activeTab === 'live_alerts' && (
        <div className="space-y-6">
          {/* Quick Simulation Playground Bar */}
          <div className="glass-card p-4 rounded-2xl border border-red-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>شريط الاختبار الميداني: إطلاق ومحاكاة محاولات المضاربة على الخادم</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                اختبار آلية اعتراض الأسعار، تسجيل المخالفة، وإطلاق صوت التنبيه اللحظي
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={handleSimulatePotatoSpeculation}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 transition-colors font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
              >
                <Play className="w-3.5 h-3.5 text-red-400" />
                <span>مضاربة بطاطا: عرض 85 دج (السقف 65 دج) [تجاوز +30.8%]</span>
              </button>

              <button
                onClick={handleSimulateTomatoSpeculation}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 transition-colors font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
              >
                <Play className="w-3.5 h-3.5 text-red-400" />
                <span>مضاربة طماطم: عرض 78 دج (السقف 55 دج) [تجاوز +41.8%]</span>
              </button>

              <button
                onClick={handleSimulateUnderFloor}
                className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 transition-colors font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>بخس الفلاح: عرض 25 دج (الحد الأدنى 35 دج)</span>
              </button>

              <button
                onClick={handleSimulateCompliantTrade}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 transition-colors font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>صفقة مقننة: 52 دج بطاطا (COMMIT وتوليد سند الشحن)</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-950/70 p-3 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">حالة المخالفة:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                جميع التنبيهات ({violations.length})
              </button>
              <button
                onClick={() => setFilterStatus('unresolved')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filterStatus === 'unresolved'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                قيد المعاينة ({violations.filter(v => v.status === 'unresolved').length})
              </button>
              <button
                onClick={() => setFilterStatus('frozen')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filterStatus === 'frozen'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                حسابات مجمدة ({violations.filter(v => v.status === 'frozen').length})
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>سرعة الاستجابة: أقل من 100ms عبر WebSockets</span>
            </div>
          </div>

          {/* List of Violation Alert Cards (Styled exactly as requested by user) */}
          <div className="space-y-4">
            {filteredViolations.map((alert) => {
              const isFrozen = alert.status === 'frozen';
              const isInvestigated = alert.status === 'investigated';
              const isPenalized = alert.status === 'penalized';

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl p-5 shadow-2xl border transition-all duration-300 ${
                    alert.status === 'unresolved'
                      ? 'bg-slate-900/90 border-r-4 border-r-red-500 border-red-500/40 hover:border-red-400 shadow-red-950/50'
                      : isFrozen
                        ? 'bg-slate-900/80 border-r-4 border-r-amber-500 border-amber-500/40'
                        : 'bg-slate-900/60 border-slate-700'
                  }`}
                >
                  {/* Top Bar of Alert Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/20 text-red-400 text-xs font-black px-2.5 py-1 rounded-lg border border-red-500/30 flex items-center gap-1.5 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        تجاوز السقف بنسبة {alert.excessPercentage}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        كود التنبيه: {alert.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isFrozen && (
                        <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          تم تجميد الحساب
                        </span>
                      )}
                      {isInvestigated && (
                        <span className="text-[11px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          قيد التحقيق الميداني
                        </span>
                      )}
                      {isPenalized && (
                        <span className="text-[11px] font-bold bg-purple-400/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Gavel className="w-3 h-3" />
                          تمت المصادرة والغرامة
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{alert.timestamp}</span>
                    </div>
                  </div>

                  {/* 4 Columns Data Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[11px]">المشتري (التاجر المشتبه به):</span>
                      <strong className="text-white text-sm">{alert.buyerName}</strong>
                      <span className="text-[10px] text-slate-500 block font-mono">معرّف: {alert.buyerId}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">المادة الفلاحية والموقع:</span>
                      <strong className="text-amber-400 text-sm">{alert.cropName}</strong>
                      <span className="text-[11px] text-slate-300 block">{alert.wilaya}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">السعر المحاول للشراء:</span>
                      <strong className="text-red-400 text-base font-mono font-black">{alert.attemptedPrice} د.ج / كغ</strong>
                      <span className="text-[10px] text-red-300 block">تم حظره وإلغاؤه فورياً</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">السقف السعري القانوني:</span>
                      <strong className="text-emerald-400 text-base font-mono font-black">{alert.maxLegalPrice} د.ج / كغ</strong>
                      <span className="text-[10px] text-slate-400 block">الحد الأدنى: {alert.minFloorPrice} د.ج</span>
                    </div>
                  </div>

                  {/* Notes / Action Taken */}
                  {alert.actionTaken ? (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{alert.actionTaken}</span>
                    </div>
                  ) : alert.notes ? (
                    <p className="text-xs text-slate-400 italic">
                      {alert.notes}
                    </p>
                  ) : null}

                  {/* Operational Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => freezeUserAccount(alert.buyerId, alert.id)}
                      disabled={isFrozen}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isFrozen
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isFrozen ? 'الحساب مجمد' : 'تجميد الحساب'}</span>
                    </button>

                    <button
                      onClick={() => investigateAlert(alert.id)}
                      disabled={isInvestigated}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isInvestigated
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>إحالة للتحقيق</span>
                    </button>

                    <button
                      onClick={() => penalizeAlert(alert.id)}
                      disabled={isPenalized}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isPenalized
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold'
                      }`}
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>مصادرة الشحنة</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredViolations.length === 0 && (
              <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mx-auto" />
                <h4 className="text-base font-bold text-white">لا توجد محاولات مضاربة مسجلة حالياً</h4>
                <p className="text-xs text-slate-400">
                  النظام قيد المراقبة المستمرة. يمكنك استخدام شريط الاختبار أعلاه لمحاكاة مخالفة وملاحظة الاستجابة الفورية.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Tab 2: ACID Execution Sandbox */}
      {activeTab === 'acid_engine' && (
        <ACIDSimulator />
      )}

      {/* Main Tab 3: PostgreSQL Schema & ERD Viewer */}
      {activeTab === 'schema_erd' && (
        <DatabaseSchemaViewer />
      )}
    </div>
  );
};
