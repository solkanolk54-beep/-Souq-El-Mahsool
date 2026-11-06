import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { PriceControlManager } from './PriceControlManager';
import { SovereignInterventionModal } from './SovereignInterventionModal';
import { StatsCard } from '../common/StatsCard';
import { CropListing } from '../../types';
import { 
  Landmark, 
  Scale, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Truck, 
  Coins, 
  Warehouse,
  FileBadge,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const StateCooperativePortal: React.FC = () => {
  const { 
    crops, 
    contracts, 
    priceCeilings, 
    wilayaBalances, 
    setSelectedContractForModal,
    addToast 
  } = useMarket();

  const [activeSubTab, setActiveSubTab] = useState<'sovereign_buy' | 'price_control' | 'regional_balance'>('sovereign_buy');
  const [selectedCropForIntervention, setSelectedCropForIntervention] = useState<CropListing | null>(null);

  // Filter crops needing sovereign intervention (available in open market or strategic crops)
  const cropsReadyForState = crops.filter(c => !c.statePurchased);
  const statePurchasedCrops = crops.filter(c => c.statePurchased);

  // Cumulative Sovereign metrics
  const totalStatePurchasedTons = statePurchasedCrops.reduce((acc, c) => acc + c.availableQuantityTons, 0);
  const totalStateSpendingDZD = statePurchasedCrops.reduce((acc, c) => {
    return acc + (c.statePurchaseDetails ? c.statePurchaseDetails.totalAmountDZD : 0);
  }, 0);

  const handleDispatchOrder = (fromWilaya: string, toWilaya: string, cropName: string, quantityTons: number) => {
    addToast({
      type: 'success',
      title: 'تم إصدار أمر التحويل اللوجستي السيادي 🚚',
      message: `تم توجيه ${quantityTons.toLocaleString()} طن من ${cropName} من مستودعات ${fromWilaya} نحو شبكات التوزيع بـ ${toWilaya} لكسر أي ضغط على الأسعار.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sovereign Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#042417] via-[#073623] to-[#041a12] border-2 border-amber-400/50 p-6 shadow-2xl gold-glow">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/50 px-3 py-1 rounded-full text-xs text-amber-300 font-bold">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>النافذة السيادية لديوان ضبط الإنتاج الفلاحي والتعاونيات العمومية</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              منظومة الشراء السيادي، تسقيف الأسعار، وتأمين المخزون الاستراتيجي
            </h1>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              ذراع الدولة التنفيذي لحماية الفلاح من تذبذب الأسعار، كسر المضاربة والاحتكار، وإدارة التدخل الفوري بالضخ والشراء المباشر عبر مؤسسات SARPA و ONILEV وتعاونيات الحبوب CCLS.
            </p>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-amber-400/30 shrink-0">
            <button
              onClick={() => setActiveSubTab('sovereign_buy')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'sovereign_buy'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>الشراء السيادي الفوري ({cropsReadyForState.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('price_control')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'price_control'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>تسقيف وضبط الأسعار ({priceCeilings.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('regional_balance')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'regional_balance'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>التوازن الجهوي والفائض</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي الشراء السيادي للدولة"
          value={`${totalStatePurchasedTons.toLocaleString()} طن`}
          subtitle="شحنات ممتصة لحساب المخزون"
          icon={<Landmark className="w-6 h-6" />}
          accentColor="gold"
          trend={{ value: '+28%', isPositive: true, label: 'مقارنة بالموسم السابق' }}
        />
        <StatsCard
          title="السيولة المالية المصروفة"
          value={`${(totalStateSpendingDZD / 1000000).toFixed(1)} مليون د.ج`}
          subtitle="دفع مباشر للفلاحين عبر الخزينة"
          icon={<Coins className="w-6 h-6" />}
          accentColor="emerald"
        />
        <StatsCard
          title="احتياطي المخزون الاستراتيجي"
          value="88 يوماً"
          subtitle="تغطية كاملة للمواد الأساسية"
          icon={<Warehouse className="w-6 h-6" />}
          accentColor="blue"
          trend={{ value: 'مستوى أمان ممتاز', isPositive: true }}
        />
        <StatsCard
          title="المواد الفلاحية المسقفة رسمياً"
          value={`${priceCeilings.length} مواد`}
          subtitle="مراسيم تنفيذية سارية المفعول"
          icon={<Scale className="w-6 h-6" />}
          accentColor="amber"
        />
      </div>

      {/* Sub-Tab 1: Sovereign Buy Engine */}
      {activeSubTab === 'sovereign_buy' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>محاصيل الفلاحين المؤهلة للشراء السيادي المباشر</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  {cropsReadyForState.length} شحنة متاحة
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                اضغط على زر <strong className="text-amber-300">"تدخل الدولة والشراء الفوري"</strong> لامتصاص الشحنة بسعر عادل للفلاح، وتوجيهها للمخزن الاستراتيجي وإصدار شهادة الدفع المضمون خلال 48 ساعة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropsReadyForState.map((crop) => {
              const ceiling = crop.statutoryCeilingPricePerKg;
              const proposed = crop.proposedPricePerKg;
              const totalAmount = proposed * crop.availableQuantityTons * 1000;

              return (
                <div
                  key={crop.id}
                  className="glass-card rounded-2xl border border-emerald-500/20 hover:border-amber-400/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                      <img
                        src={crop.imageUrl}
                        alt={crop.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent" />

                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                          {crop.category}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-xs text-white">
                        <span className="font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded font-mono">
                          {crop.availableQuantityTons} طن ({crop.availableQuantityTons * 10} قنطار)
                        </span>
                        <span className="text-slate-300 bg-black/50 px-2 py-0.5 rounded flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {crop.wilaya}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-base line-clamp-1">{crop.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{crop.notes}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/15 text-xs">
                        <p className="font-semibold text-slate-200">{crop.farmerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{crop.nationalFarmerCardId} • {crop.farmerPhone}</p>
                      </div>

                      <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">سعر الفلاح المعروض:</span>
                          <span className="font-black font-mono text-emerald-300 text-sm">{proposed} د.ج / كغ</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">السقف القانوني المعتمد:</span>
                          <span className="font-bold font-mono text-amber-400">{ceiling} د.ج / كغ</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-slate-300 font-bold">
                          <span>قيمة الشراء التقديرية:</span>
                          <span className="text-amber-400 font-mono">{totalAmount.toLocaleString()} د.ج</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sovereign Action Button */}
                  <div className="p-4 bg-slate-950/90 border-t border-emerald-500/15">
                    <button
                      onClick={() => setSelectedCropForIntervention(crop)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer gold-glow"
                    >
                      <Landmark className="w-4 h-4" />
                      <span>تدخل الدولة والشراء الفوري</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {cropsReadyForState.length === 0 && (
            <div className="glass-card p-12 rounded-2xl border border-emerald-500/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">تم استيعاب وتأمين كافة المحاصيل المعروضة!</h3>
              <p className="text-xs text-slate-400">
                جميع الشحنات المسجلة إما تم شراؤها سيادياً أو بيعها لتجار الجملة الملتزمين بالسقف السعري.
              </p>
            </div>
          )}

          {/* Already State-Purchased Historical Records */}
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileBadge className="w-5 h-5 text-amber-400" />
              <span>شحنات المخزون الاستراتيجي المشتراة مؤخراً ({statePurchasedCrops.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statePurchasedCrops.map((crop) => {
                const details = crop.statePurchaseDetails;
                if (!details) return null;

                return (
                  <div
                    key={crop.id}
                    className="glass-card p-5 rounded-2xl border border-amber-500/30 space-y-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono font-bold block">
                          شهادة رقم: {details.certificateNumber}
                        </span>
                        <h4 className="font-bold text-white text-sm">{crop.title}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                        مخزون أمان مؤمن
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">الديوان المشتري:</span>
                        <span className="text-white font-semibold">{details.cooperativeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">مستودع التخزين:</span>
                        <span className="text-slate-200">{details.siloDestination}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">الكمية المشحونة:</span>
                        <span className="text-amber-400 font-mono font-bold">{details.totalQuantityTons} طن</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">المبلغ الإجمالي:</span>
                        <span className="text-emerald-400 font-mono font-bold">{details.totalAmountDZD.toLocaleString()} د.ج</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{details.purchaseDate}</span>
                      <button
                        onClick={() => {
                          const found = contracts.find(c => c.listingId === crop.id);
                          if (found) setSelectedContractForModal(found);
                        }}
                        className="text-xs font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
                      >
                        معاينة سند الشحن الحكومي
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Price Ceiling Control Manager */}
      {activeSubTab === 'price_control' && (
        <PriceControlManager />
      )}

      {/* Sub-Tab 3: Wilayas Balance & Logistics Dispatch */}
      {activeSubTab === 'regional_balance' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/30 flex items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                مرصد التوازن الجهوي: مراقبة الفائض والعجز وتوجيه سلاسل الإمداد
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                تتبع الإنتاج الفائض في ولايات الجنوب والوسط ونقله فورياً نحو المدن الكبرى عبر أسطول التبريد الوطني لمنع الاختناق وتفادي ارتفاع الأسعار.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wilayaBalances.map((item) => {
              const isSurplus = item.status === 'surplus';
              const isDeficit = item.status === 'deficit';

              return (
                <div
                  key={item.wilayaCode}
                  className={`glass-card p-5 rounded-2xl border transition-all shadow-xl space-y-3 ${
                    isSurplus 
                      ? 'border-emerald-500/30 bg-emerald-950/20' 
                      : isDeficit 
                        ? 'border-red-500/40 bg-red-950/20' 
                        : 'border-slate-700 bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">ولاية {item.wilayaCode}</span>
                      <h4 className="text-lg font-bold text-white">{item.wilayaName}</h4>
                    </div>

                    {isSurplus && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        فائض إنتاجي
                      </span>
                    )}

                    {isDeficit && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1 animate-pulse">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        عجز استهلاكي
                      </span>
                    )}

                    {!isSurplus && !isDeficit && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        توازن مستقر
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-slate-100">{item.majorCrop}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      المحاصيل: {item.primaryCrops.join('، ')}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-emerald-500/10">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>امتلاء غرف التبريد:</span>
                      <span className="font-mono font-bold text-white">{item.storageCapacityUtilizationPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.storageCapacityUtilizationPercent > 80 
                            ? 'bg-amber-400' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.storageCapacityUtilizationPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Dispatch action if surplus */}
                  {isSurplus && (
                    <button
                      onClick={() => handleDispatchOrder(item.wilayaName, 'الجزائر العاصمة ووهران', item.primaryCrops[0], 5000)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>إصدار أمر تحويل شحنة تبريد</span>
                    </button>
                  )}

                  {isDeficit && (
                    <button
                      onClick={() => handleDispatchOrder('الوادي ومعسكر', item.wilayaName, 'بطاطا وبصل', 8000)}
                      className="w-full py-2 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                      <span>طلب ضخ عاجل من المخزون</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sovereign Intervention Modal */}
      <SovereignInterventionModal
        crop={selectedCropForIntervention}
        isOpen={!!selectedCropForIntervention}
        onClose={() => setSelectedCropForIntervention(null)}
      />
    </div>
  );
};
