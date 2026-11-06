import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const ACIDSimulator: React.FC = () => {
  const { crops, priceCeilings, acidLogs, executeACIDSimulation } = useMarket();

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || 'crop-101');
  const [buyerName, setBuyerName] = useState('مؤسسة الأوراس لتجارة وتوزيع الخضر بالجملة');
  const [quantityTons, setQuantityTons] = useState<number>(15);
  const [pricePerKg, setPricePerKg] = useState<number>(55);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];
  const matchingCeiling = priceCeilings.find(c => 
    c.cropName.includes(selectedCrop?.variety || '') || 
    selectedCrop?.title.includes(c.cropName) ||
    c.category === selectedCrop?.category
  );

  const ceilingLimit = matchingCeiling ? matchingCeiling.maxLegalPricePerKg : 65;
  const floorLimit = matchingCeiling ? matchingCeiling.recommendedFloorPricePerKg : 40;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const result = executeACIDSimulation(
      selectedCropId,
      buyerName,
      Number(quantityTons),
      Number(pricePerKg),
      isPrivate
    );
    setLastResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              محاكي المعاملات البرمجية الآمنة (PostgreSQL ACID Transactions Engine)
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                BEGIN / COMMIT / ROLLBACK
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              يضمن هذا المحرك تطابق البيانات وعدم حدوث أي عجز في المخزون، مع رفض فوري تلقائي لأي محاولة مضاربة وتوثيقها في جدول المخالفات.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-emerald-500/20">
            <Database className="w-4 h-4 text-amber-400" />
            <span>بيانات المعاملة المراد اختبارها (POST /api/transactions)</span>
          </h4>

          <form onSubmit={handleExecute} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                اختر المحصول المسجل لدى الفلاح *
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => {
                  setSelectedCropId(e.target.value);
                  const found = crops.find(c => c.id === e.target.value);
                  if (found) setPricePerKg(found.proposedPricePerKg);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.wilaya})
                  </option>
                ))}
              </select>
            </div>

            {/* Ceiling info banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">السقف القانوني الأقصى:</span>
                <span className="text-amber-400 font-bold">{ceilingLimit} د.ج / كغ</span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[10px]">الحد الأدنى لحماية الفلاح:</span>
                <span className="text-emerald-400 font-bold">{floorLimit} د.ج / كغ</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                اسم الجهة المشترية *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  الكمية (بالطن) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityTons}
                  onChange={(e) => setQuantityTons(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  السعر المقترح (د.ج / كغ) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl border font-mono font-bold text-xs focus:outline-none ${
                    pricePerKg > ceilingLimit
                      ? 'bg-red-950/60 border-red-500 text-red-300'
                      : pricePerKg < floorLimit
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-emerald-500 text-emerald-300'
                  }`}
                />
              </div>
            </div>

            {/* Quick Price Shortcuts */}
            <div className="flex gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setPricePerKg(ceilingLimit + 20)}
                className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300"
              >
                تجاوز السقف ({ceilingLimit + 20} دج)
              </button>
              <button
                type="button"
                onClick={() => setPricePerKg(ceilingLimit - 10)}
                className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300"
              >
                سعر نظامي ({ceilingLimit - 10} دج)
              </button>
              <button
                type="button"
                onClick={() => setPricePerKg(floorLimit - 15)}
                className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300"
              >
                تحت الأدنى ({floorLimit - 15} دج)
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">نوع الشراء:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    isPrivate ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  تاجر خاص (private_purchase)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    !isPrivate ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  شراء سيادي للدولة
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4" />
              <span>تنفيذ المعاملة عبر محرك ACID</span>
            </button>
          </form>

          {/* Last Result Notification */}
          {lastResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                lastResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/40 text-red-200'
              }`}
            >
              {lastResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{lastResult.message}</span>
            </div>
          )}
        </div>

        {/* Right: Live Execution Console (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl border border-slate-800 space-y-3 bg-[#020d09]">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>سجل أوامر SQL وسلسلة ACID Transactions اللحظية</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {acidLogs.length} سجلات
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 font-mono text-xs">
            {acidLogs.map((log) => {
              const border = {
                success: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
                danger: 'border-red-500/40 bg-red-950/30 text-red-200',
                warning: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
                info: 'border-slate-700 bg-slate-900/50 text-slate-300',
              }[log.status];

              return (
                <div key={log.id} className={`p-3.5 rounded-xl border ${border} space-y-2`}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      {log.step}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                  </div>

                  <pre className="p-2.5 bg-black/70 rounded-lg text-emerald-300 overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
                    {log.sqlSnippet}
                  </pre>

                  <p className="text-[11px] font-sans opacity-90">
                    {log.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
