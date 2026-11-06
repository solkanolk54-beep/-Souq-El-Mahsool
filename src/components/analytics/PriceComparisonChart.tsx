import React, { useState } from 'react';
import { ShieldCheck, TrendingDown, Info } from 'lucide-react';

interface CropPriceComparison {
  name: string;
  category: string;
  priceBeforeIntervention: number; // السعر في السوق الحرة مع المضاربة
  statutoryCeiling: number; // السقف القانوني للدولة
  priceAfterIntervention: number; // السعر المستقر بعد تدخل الدولة والضخ
  dropPercent: number;
}

const COMPARISON_DATA: CropPriceComparison[] = [
  {
    name: 'بطاطا الاستهلاك (وادي سوف)',
    category: 'خضروات',
    priceBeforeIntervention: 95,
    statutoryCeiling: 65,
    priceAfterIntervention: 54,
    dropPercent: 43.1,
  },
  {
    name: 'طماطم حقلية (مستغانم)',
    category: 'خضروات',
    priceBeforeIntervention: 85,
    statutoryCeiling: 55,
    priceAfterIntervention: 46,
    dropPercent: 45.8,
  },
  {
    name: 'بصل جاف للتخزين (معسكر)',
    category: 'خضروات',
    priceBeforeIntervention: 70,
    statutoryCeiling: 50,
    priceAfterIntervention: 39,
    dropPercent: 44.2,
  },
  {
    name: 'تفاح محلي (الأوراس باتنة)',
    category: 'فواكه',
    priceBeforeIntervention: 340,
    statutoryCeiling: 240,
    priceAfterIntervention: 215,
    dropPercent: 36.7,
  },
  {
    name: 'ثوم جاف محلي (ميلة)',
    category: 'خضروات',
    priceBeforeIntervention: 550,
    statutoryCeiling: 350,
    priceAfterIntervention: 310,
    dropPercent: 43.6,
  },
];

export const PriceComparisonChart: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropPriceComparison>(COMPARISON_DATA[0]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-emerald-500/25 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>أثر التدخل السيادي للتعاونيات العمومية</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            مقارنة أسعار المواد واسعة الاستهلاك قبل وبعد تدخل الدولة
          </h3>
          <p className="text-xs text-slate-400">
            تطور سعر الكيلوغرام في السوق المفتوحة مقارنة بسقف الدولة وسعر الاستقرار بعد الضخ المباشر
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/15">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/80"></span>
            <span className="text-slate-300">سعر السوق مع المضاربة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400"></span>
            <span className="text-slate-300">سقف الدولة القانوني</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span className="text-slate-300">السعر بعد تدخل التعاونية</span>
          </div>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="space-y-4">
        {COMPARISON_DATA.map((item) => {
          const isSelected = selectedCrop.name === item.name;
          const maxScale = Math.max(...COMPARISON_DATA.map(d => d.priceBeforeIntervention));
          const widthBefore = (item.priceBeforeIntervention / maxScale) * 100;
          const widthCeiling = (item.statutoryCeiling / maxScale) * 100;
          const widthAfter = (item.priceAfterIntervention / maxScale) * 100;

          return (
            <div
              key={item.name}
              onClick={() => setSelectedCrop(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/40 border-amber-400/50 gold-glow'
                  : 'bg-slate-950/50 border-emerald-500/15 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({item.category})</span>
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  انخفاض بنسبة -{item.dropPercent}%
                </span>
              </div>

              {/* Bars */}
              <div className="space-y-2">
                {/* Before Intervention */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-red-300">قبل التدخل (المضاربة):</span>
                    <span className="text-red-400 font-mono font-bold">{item.priceBeforeIntervention} د.ج / كغ</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-500/80 h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthBefore}%` }}
                    />
                  </div>
                </div>

                {/* Statutory Ceiling */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-300">سقف الدولة القانوني:</span>
                    <span className="text-amber-400 font-mono font-bold">{item.statutoryCeiling} د.ج / كغ</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthCeiling}%` }}
                    />
                  </div>
                </div>

                {/* After Intervention */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300 font-bold">بعد الشراء والضخ السيادي:</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs">{item.priceAfterIntervention} د.ج / كغ</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthAfter}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Crop Analysis Insight */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/30 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            تحليل أثر التدخل على مادة: {selectedCrop.name}
          </p>
          <p className="text-slate-300 leading-relaxed">
            أدى الشراء المباشر من الفلاحين بمعدل <strong className="text-emerald-400">{selectedCrop.priceAfterIntervention} د.ج</strong> وضخه عبر نقاط بيع الدواوين العمومية إلى إسقاط هوامش الوسطاء المبالغ فيها، موفراً على المستهلك الجزائري <strong className="text-amber-300">{(selectedCrop.priceBeforeIntervention - selectedCrop.priceAfterIntervention).toFixed(0)} د.ج في كل كيلوغرام</strong> مع ضمان ربح عادل ومستقر للمنتج الفلاحي.
          </p>
        </div>
      </div>
    </div>
  );
};
