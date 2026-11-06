import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { CropListing } from '../../types';
import { ALGERIAN_WILAYAS_LIST } from '../../data/mockData';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck, 
  Calculator,
  MapPin,
  Building,
  Calendar
} from 'lucide-react';

interface WholesalerOrderModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WholesalerOrderModal: React.FC<WholesalerOrderModalProps> = ({ crop, isOpen, onClose }) => {
  const { submitWholesalerOffer } = useMarket();

  const [wholesalerName, setWholesalerName] = useState('عمر بن خدة');
  const [companyName, setCompanyName] = useState('مؤسسة الوفاق لتجارة وتوزيع الخضر بالجملة');
  const [taxNumber, setTaxNumber] = useState('NIF-0019381029381');
  const [phone, setPhone] = useState('0550 12 34 56');
  const [destinationWilaya, setDestinationWilaya] = useState('الجزائر (16)');
  const [offeredPricePerKg, setOfferedPricePerKg] = useState<number>(crop ? crop.proposedPricePerKg : 50);
  const [requestedQuantityTons, setRequestedQuantityTons] = useState<number>(crop ? Math.min(20, crop.availableQuantityTons) : 10);
  const [deliveryDate, setDeliveryDate] = useState('2026-11-09');

  // When crop changes, update default price & quantity
  React.useEffect(() => {
    if (crop) {
      setOfferedPricePerKg(crop.proposedPricePerKg);
      setRequestedQuantityTons(Math.min(20, crop.availableQuantityTons));
    }
  }, [crop]);

  if (!isOpen || !crop) return null;

  const ceiling = crop.statutoryCeilingPricePerKg;
  const isWithinCeiling = offeredPricePerKg <= ceiling;
  const totalCropAmountDZD = offeredPricePerKg * requestedQuantityTons * 1000;
  
  // Approximate logistics cost per ton based on distance simulation
  const estimatedLogisticsDZD = requestedQuantityTons * 3500; 
  const grandTotalDZD = totalCropAmountDZD + estimatedLogisticsDZD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wholesalerName || !companyName) return;

    const success = submitWholesalerOffer(crop.id, {
      wholesalerName,
      companyName,
      taxNumber,
      wilaya: destinationWilaya,
      offeredPricePerKg: Number(offeredPricePerKg),
      requestedQuantityTons: Number(requestedQuantityTons),
      phone,
      deliveryDate,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#082218] to-[#04140e] rounded-2xl border border-amber-500/30 shadow-2xl p-6 my-8 text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                تقديم طلب شراء رسمي مقنن لتاجر الجملة
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono">
                  صفقة خاضعة للسقف القانوني
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تسجيل العقد يضمن إصدار رخصة نقل وسند شحن رسمي معتمد لتفادي حجز الشحنات
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

        {/* Selected Crop Summary */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={crop.imageUrl} 
              alt={crop.title} 
              className="w-14 h-14 rounded-lg object-cover border border-emerald-500/30"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{crop.title}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>المستثمرة: {crop.farmerName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {crop.wilaya}
                </span>
              </p>
            </div>
          </div>

          <div className="text-left shrink-0">
            <span className="text-[11px] text-slate-400 block">سعر الفلاح المعروض:</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {crop.proposedPricePerKg} د.ج / كغ
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم تاجر الجملة أو المسير *
              </label>
              <input
                type="text"
                required
                value={wholesalerName}
                onChange={(e) => setWholesalerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم الشركة أو مؤسسة التوزيع *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الرقم الجبائي / السجل التجاري
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رقم هاتف الاتصال المباشر
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ولاية التفريغ ومستودع الجملة *
              </label>
              <select
                value={destinationWilaya}
                onChange={(e) => setDestinationWilaya(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              >
                {ALGERIAN_WILAYAS_LIST.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Statutory Cap Check */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                سقف السعر القانوني الإلزامي المحدد من الدولة:
              </span>
              <span className="font-black text-amber-400 font-mono text-sm bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {ceiling} د.ج / كغ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  السعر المعروض للشراء (د.ج / كغ) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={offeredPricePerKg}
                  onChange={(e) => setOfferedPricePerKg(Number(e.target.value))}
                  className={`w-full px-3 py-2.5 rounded-xl border text-base font-bold font-mono focus:outline-none ${
                    isWithinCeiling
                      ? 'bg-slate-900 border-emerald-500 text-emerald-300 focus:border-emerald-400'
                      : 'bg-red-950/40 border-red-500 text-red-300 focus:border-red-400'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  لا يمكن تقديم عرض شراء يفوق سقف الدولة المحدد ({ceiling} د.ج)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الكمية المطلوبة (بالطن) * [المتاح: {crop.availableQuantityTons} طن]
                </label>
                <input
                  type="number"
                  min={crop.minOrderTons || 1}
                  max={crop.availableQuantityTons}
                  required
                  value={requestedQuantityTons}
                  onChange={(e) => setRequestedQuantityTons(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-base font-bold font-mono focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  تساوي {(requestedQuantityTons * 10).toLocaleString()} قنطار
                </span>
              </div>
            </div>

            {/* Warning if ceiling is exceeded */}
            {!isWithinCeiling && (
              <div className="p-3 bg-red-950/80 rounded-xl border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>
                  تنبيه وزاري: السعر المعروض ({offeredPricePerKg} د.ج) يتجاوز السقف القانوني ({ceiling} د.ج). المنظومة تمنع التداولات غير المقننة لحظر المضاربة.
                </span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-emerald-500/15 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>قيمة المحصول الصافية ({requestedQuantityTons} طن × {offeredPricePerKg} د.ج):</span>
                <span className="text-white font-mono font-semibold">{totalCropAmountDZD.toLocaleString()} د.ج</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>تكاليف النقل والشحن التقديرية (بين الولايات):</span>
                <span className="text-white font-mono font-semibold">{estimatedLogisticsDZD.toLocaleString()} د.ج</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-emerald-500/20">
                <span className="text-amber-300">التكلفة التقديرية الإجمالية للصفقة:</span>
                <span className="text-amber-400 font-mono text-base">{grandTotalDZD.toLocaleString()} د.ج</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                isWithinCeiling
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black gold-glow'
                  : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {isWithinCeiling 
                  ? 'إرسال طلب الشراء إلى الفلاح' 
                  : 'إرسال العرض (سيتم اعتراضه آلياً وتسجيل مضاربة)'}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
