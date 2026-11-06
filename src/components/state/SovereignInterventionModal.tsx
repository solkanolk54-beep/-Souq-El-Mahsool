import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { CropListing } from '../../types';
import { 
  X, 
  Landmark, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Coins, 
  FileCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface SovereignInterventionModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SovereignInterventionModal: React.FC<SovereignInterventionModalProps> = ({ crop, isOpen, onClose }) => {
  const { executeSovereignPurchase } = useMarket();

  const [cooperativeName, setCooperativeName] = useState('الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)');
  const [siloLocation, setSiloLocation] = useState('مجمع التبريد والتخزين الاستراتيجي - بوفاريك (البليدة)');
  const [overridePrice, setOverridePrice] = useState<number>(crop ? crop.proposedPricePerKg : 50);

  React.useEffect(() => {
    if (crop) {
      setOverridePrice(crop.proposedPricePerKg);
      // Auto-select cooperative depending on crop category
      if (crop.category === 'حبوب وبقوليات') {
        setCooperativeName('تعاونية الحبوب والبقول الجافة (CCLS) - ديوان OAIC');
        setSiloLocation('صوامع الحبوب الاستراتيجية بمحطة مهدية (تيارت)');
      } else if (crop.category === 'خضروات') {
        setCooperativeName('الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)');
        setSiloLocation('مستودعات التبريد المركزية - بوفاريك (البليدة)');
      } else {
        setCooperativeName('الديوان الوطني المهني المشترك للخضر واللحوم (ONILEV)');
        setSiloLocation('غرف التبريد والضبط الجهوية - وهران السانية');
      }
    }
  }, [crop]);

  if (!isOpen || !crop) return null;

  const totalAmountDZD = overridePrice * crop.availableQuantityTons * 1000;
  const subsidyShareDZD = Math.round(totalAmountDZD * 0.1);

  const handleConfirmPurchase = () => {
    const success = executeSovereignPurchase(crop.id, cooperativeName, siloLocation, Number(overridePrice));
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a2f20] via-[#062217] to-[#04150f] rounded-2xl border-2 border-amber-400/60 shadow-2xl p-6 my-8 text-slate-100 gold-glow">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                أمر الشراء السيادي الفوري وتأمين المخزون الوطني
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                  تدخل استراتيجي للدولة
                </span>
              </h2>
              <p className="text-xs text-amber-200/80">
                شراء مباشر من الفلاح لكسر الاحتكار وضخ المحصول في شبكات التوزيع العمومية
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

        {/* Selected Produce Card */}
        <div className="my-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={crop.imageUrl} 
              alt={crop.title} 
              className="w-16 h-16 rounded-xl object-cover border border-amber-400/30"
            />
            <div>
              <h4 className="text-base font-bold text-white">{crop.title}</h4>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span>الفلاح: {crop.farmerName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">{crop.nationalFarmerCardId}</span>
                <span>•</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {crop.wilaya}
                </span>
              </p>
            </div>
          </div>

          <div className="text-left shrink-0">
            <span className="text-xs text-slate-400 block">الكمية الإجمالية للشراء:</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {crop.availableQuantityTons} طن ({crop.availableQuantityTons * 10} قنطار)
            </span>
          </div>
        </div>

        {/* Intervention Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              المؤسسة / الديوان العمومي المشتري *
            </label>
            <select
              value={cooperativeName}
              onChange={(e) => setCooperativeName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)">
                الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)
              </option>
              <option value="الديوان الوطني المهني المشترك للخضر واللحوم (ONILEV)">
                الديوان الوطني المهني المشترك للخضر واللحوم (ONILEV)
              </option>
              <option value="الديوان الجزائري المهني للحبوب (OAIC) - تعاونيات CCLS">
                الديوان الجزائري المهني للحبوب (OAIC) - تعاونيات CCLS
              </option>
              <option value="مجمع الصناعات الغذائية اللوجستية (AGROLOG)">
                مجمع الصناعات الغذائية اللوجستية (AGROLOG)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              مجمع التخزين / غرف التبريد / صوامع التفريغ الاستراتيجية *
            </label>
            <input
              type="text"
              required
              value={siloLocation}
              onChange={(e) => setSiloLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Pricing Confirmation */}
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  سعر الشراء السيادي المعتمد (د.ج / كغ) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-400 text-amber-300 font-bold font-mono text-base focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ضمن السقف القانوني المحدد بـ ({crop.statutoryCeilingPricePerKg} د.ج)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المبلغ الإجمالي المستحق للفلاح (د.ج)
                </label>
                <div className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-black font-mono text-base">
                  {totalAmountDZD.toLocaleString()} د.ج
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  دفع مضمون عبر الخزينة العمومية خلال 48 ساعة
                </span>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="pt-2 border-t border-emerald-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>إصدار سند شحن معتمد وإشعار تلقائي للجمارك والدرك الوطني لتسهيل العبور</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تفريغ المحصول مباشرة في المخزون الاستراتيجي لمنع أي نقص في السوق</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-amber-400/30 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirmPurchase}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer gold-glow"
          >
            <Landmark className="w-4 h-4" />
            <span>تأكيد الشراء السيادي وإصدار السند فوراً</span>
          </button>
        </div>

      </div>
    </div>
  );
};
