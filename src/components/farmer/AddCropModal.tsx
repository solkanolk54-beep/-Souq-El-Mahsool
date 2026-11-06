import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { CropCategory } from '../../types';
import { ALGERIAN_WILAYAS_LIST } from '../../data/mockData';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Sparkles, 
  FileCheck, 
  Image as ImageIcon 
} from 'lucide-react';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCropModal: React.FC<AddCropModalProps> = ({ isOpen, onClose }) => {
  const { addCropListing, priceCeilings } = useMarket();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CropCategory>('خضروات');
  const [variety, setVariety] = useState('بطاطا سبونتا (Spunta)');
  const [wilaya, setWilaya] = useState('الوادي (39)');
  const [commune, setCommune] = useState('المقرن');
  const [farmerName, setFarmerName] = useState('الحاج بلقاسم لعموري');
  const [farmerPhone, setFarmerPhone] = useState('0661 24 88 19');
  const [nationalFarmerCardId, setNationalFarmerCardId] = useState('DZ-39-FARM-88412');
  const [farmName, setFarmName] = useState('مستثمرة رمال الذهب الفلاحية');
  const [availableQuantityTons, setAvailableQuantityTons] = useState<number>(50);
  const [minOrderTons, setMinOrderTons] = useState<number>(5);
  const [harvestDate, setHarvestDate] = useState('2026-11-06');
  const [actualCostPerKg, setActualCostPerKg] = useState<number>(40);
  const [proposedPricePerKg, setProposedPricePerKg] = useState<number>(52);
  const [qualityGrade, setQualityGrade] = useState<'الدرجة الأولى الممتازة (Extra)' | 'الدرجة الأولى (I)' | 'الدرجة الثانية (II)'>('الدرجة الأولى الممتازة (Extra)');
  const [packagingType, setPackagingType] = useState<'صناديق خشبية مبردة' | 'أكياس خيش معتمدة' | 'صناديق بلاستيكية قياسية' | 'حمولة صب (Bulk)'>('أكياس خيش معتمدة');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80');
  const [notes, setNotes] = useState('محصول طازج معبأ ومفرز وفق المعايير المعتمدة، جاهز للشحن المباشر.');
  const [isStrategicCommodity, setIsStrategicCommodity] = useState(true);

  if (!isOpen) return null;

  // Find corresponding statutory price ceiling
  const matchingCeiling = priceCeilings.find(c => 
    c.cropName.includes(variety) || 
    variety.includes(c.cropName) || 
    title.includes(c.cropName) ||
    c.category === category
  );

  const statutoryLimit = matchingCeiling ? matchingCeiling.maxLegalPricePerKg : 65;
  const isWithinCeiling = proposedPricePerKg <= statutoryLimit;
  const profitMarginPerKg = proposedPricePerKg - actualCostPerKg;
  const profitMarginPercent = actualCostPerKg > 0 ? ((profitMarginPerKg / actualCostPerKg) * 100).toFixed(1) : '0';
  const totalGrossValueDZD = proposedPricePerKg * availableQuantityTons * 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !farmerName.trim()) return;

    const success = addCropListing({
      title,
      category,
      variety,
      wilaya,
      commune,
      farmerName,
      farmerPhone,
      nationalFarmerCardId,
      farmName,
      availableQuantityTons: Number(availableQuantityTons),
      minOrderTons: Number(minOrderTons),
      harvestDate,
      actualCostPerKg: Number(actualCostPerKg),
      proposedPricePerKg: Number(proposedPricePerKg),
      statutoryCeilingPricePerKg: statutoryLimit,
      qualityGrade,
      packagingType,
      imageUrl,
      notes,
      isStrategicCommodity,
    });

    if (success) {
      onClose();
    }
  };

  const handlePredefinedCropSelect = (selectedVariety: string, defaultCost: number, defaultPrice: number, cat: CropCategory, img: string) => {
    setVariety(selectedVariety);
    setTitle(`${selectedVariety} - محصول ولائي طازج`);
    setActualCostPerKg(defaultCost);
    setProposedPricePerKg(defaultPrice);
    setCategory(cat);
    setImageUrl(img);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#06241a] to-[#04150f] rounded-2xl border border-emerald-500/30 shadow-2xl p-6 my-8 text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center shadow-md">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                إضافة محصول زراعي جديد للبوابة الوطنية
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  تحت إشراف ديوان الضبط الفلاحي
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تسجيل العرض مع فحص فوري ومطابقة آلية مع السقف السعري القانوني لحماية الفلاح والمستهلك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-950/80 text-slate-400 hover:text-white hover:bg-emerald-900/80 border border-emerald-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets for realistic Algerian produce */}
        <div className="my-4 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
          <p className="text-xs text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            نماذج سريعة من المحاصيل الاستراتيجية الأكثر طلباً:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePredefinedCropSelect('بطاطا سبونتا (Spunta)', 40, 52, 'خضروات', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80')}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 transition-colors"
            >
              🥔 بطاطا استهلاك (تكلفة 40 دج / عرض 52 دج)
            </button>
            <button
              type="button"
              onClick={() => handlePredefinedCropSelect('طماطم حقلية ناضجة', 35, 45, 'خضروات', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80')}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 transition-colors"
            >
              🍅 طماطم حقلية (تكلفة 35 دج / عرض 45 دج)
            </button>
            <button
              type="button"
              onClick={() => handlePredefinedCropSelect('بصل أحمر جاف للتخزين', 28, 38, 'خضروات', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80')}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 transition-colors"
            >
              🧅 بصل جاف (تكلفة 28 دج / عرض 38 دج)
            </button>
            <button
              type="button"
              onClick={() => handlePredefinedCropSelect('قمح صلب سيميتو معتمد', 45, 60, 'حبوب وبقوليات', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80')}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 transition-colors"
            >
              🌾 قمح صلب (دعم الدولة 60 دج / 6000 دج قنطار)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                عنوان المحصول التجاري *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: بطاطا موسمية استهلاكية ممتازة من مزارع وادي سوف"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الشعبة الفلاحية *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CropCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="خضروات">خضروات</option>
                <option value="حبوب وبقوليات">حبوب وبقوليات</option>
                <option value="فواكه">فواكه</option>
                <option value="تمور">تمور</option>
                <option value="حمضيات">حمضيات</option>
              </select>
            </div>
          </div>

          {/* Wilaya, Commune, Farmer details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ولاية الإنتاج *
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                {ALGERIAN_WILAYAS_LIST.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                البلدية والموقع
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="البلدية"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم الفلاح / المستثمرة *
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رقم بطاقة الفلاح المهنية
              </label>
              <input
                type="text"
                value={nationalFarmerCardId}
                onChange={(e) => setNationalFarmerCardId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quantities & Packaging */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الكمية المعروضة (بالطن) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={availableQuantityTons}
                onChange={(e) => setAvailableQuantityTons(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                تساوي {(availableQuantityTons * 10).toLocaleString()} قنطار
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                أدنى كمية للطلب (بالطن)
              </label>
              <input
                type="number"
                min="1"
                value={minOrderTons}
                onChange={(e) => setMinOrderTons(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                درجة الجودة والفرز
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="الدرجة الأولى الممتازة (Extra)">الدرجة الأولى الممتازة (Extra)</option>
                <option value="الدرجة الأولى (I)">الدرجة الأولى (I)</option>
                <option value="الدرجة الثانية (II)">الدرجة الثانية (II)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                نوع التوضيب والتعبئة
              </label>
              <select
                value={packagingType}
                onChange={(e) => setPackagingType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="أكياس خيش معتمدة">أكياس خيش معتمدة</option>
                <option value="صناديق بلاستيكية قياسية">صناديق بلاستيكية قياسية</option>
                <option value="صناديق خشبية مبردة">صناديق خشبية مبردة</option>
                <option value="حمولة صب (Bulk)">حمولة صب (Bulk)</option>
              </select>
            </div>
          </div>

          {/* CRITICAL: Price, Cost, Statutory Ceiling Checker */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border-2 border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                آلية فحص السقف السعري وهوامش الربح
              </h3>
              <span className="text-xs text-slate-400">
                السقف القانوني المعتمد: <strong className="text-amber-400 font-mono text-sm">{statutoryLimit} د.ج / كغ</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  التكلفة الفعلية للكيلوغرام (د.ج) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={actualCostPerKg}
                  onChange={(e) => setActualCostPerKg(Number(e.target.value))}
                  placeholder="التكلفة الحقيقية"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-base font-bold font-mono focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">بما يشمل البذور، الأسمدة، الطاقة، اليد العاملة</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  السعر المقترح للبيع (د.ج / كغ) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={proposedPricePerKg}
                  onChange={(e) => setProposedPricePerKg(Number(e.target.value))}
                  placeholder="سعر البيع المقترح"
                  className={`w-full px-3 py-2.5 rounded-xl border text-base font-bold font-mono focus:outline-none ${
                    isWithinCeiling
                      ? 'bg-slate-900 border-emerald-500 text-emerald-300 focus:border-emerald-400'
                      : 'bg-red-950/40 border-red-500 text-red-300 focus:border-red-400'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">سعر تسليم باب المزرعة</span>
              </div>

              {/* Live Calculator Result Card */}
              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">هامش ربح الفلاح:</span>
                  <span className={`font-bold font-mono ${profitMarginPerKg >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    +{profitMarginPerKg.toFixed(1)} د.ج / كغ ({profitMarginPercent}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400">القيمة الإجمالية للعرض:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {totalGrossValueDZD.toLocaleString()} د.ج
                  </span>
                </div>
                <div className="mt-2">
                  {isWithinCeiling ? (
                    <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>مطابق للسقف القانوني - مؤهل للشراء السيادي والتجاري</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-300 text-xs font-semibold bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>مخالف للسقف القانوني ({statutoryLimit} د.ج)! يمنع النشر لتفادي المضاربة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Image & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                رابط صورة حقيقية للمحصول أو الحقل
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات وتفاصيل إضافية للشاحنين
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Strategic Commodity Flag */}
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-emerald-500/20">
            <input
              type="checkbox"
              id="isStrategic"
              checked={isStrategicCommodity}
              onChange={(e) => setIsStrategicCommodity(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded bg-slate-950 border-emerald-500/40 focus:ring-emerald-500"
            />
            <label htmlFor="isStrategic" className="text-xs text-slate-200 cursor-pointer">
              تصنيف المحصول كمادة استراتيجية واسعة الاستهلاك (تستفيد من الأولوية في الشراء السيادي الفوري من طرف دواوين الدولة SARPA / ONILEV)
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!isWithinCeiling}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
                isWithinCeiling
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-emerald-950 font-black gold-glow cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>نشر المحصول في البورصة الوطنية</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
