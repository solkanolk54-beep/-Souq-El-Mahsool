import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { ALGERIAN_WILAYAS_LIST } from '../../data/mockData';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  MapPin, 
  Building 
} from 'lucide-react';

interface ReportSpeculationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportSpeculationModal: React.FC<ReportSpeculationModalProps> = ({ isOpen, onClose }) => {
  const { reportSpeculation } = useMarket();

  const [cropName, setCropName] = useState('بطاطا الاستهلاك');
  const [wilaya, setWilaya] = useState('الجزائر (16)');
  const [priceSpotted, setPriceSpotted] = useState<number>(85);
  const [wholesalerStoreName, setWholesalerStoreName] = useState('مستودع غير مصرح - سوق الجملة بالكاليتوس');
  const [notes, setNotes] = useState('محاولة بيع صناديق البطاطا بـ 85 دج للكيلوغرام متجاوزاً السقف القانوني المحدد بـ 65 دج مع الامتناع عن تقديم الفاتورة.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportSpeculation({
      cropName,
      wilaya,
      priceSpotted: Number(priceSpotted),
      wholesalerStoreName,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#240808] via-[#1a0606] to-[#0f0404] rounded-2xl border-2 border-red-500/60 shadow-2xl p-6 my-8 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                التبليغ عن مضاربة غير مشروعة أو خرق للسقف السعري
              </h2>
              <p className="text-xs text-red-300">
                الخط المباشر للمفتشية العامة لقمع الغش والرقابة الاقتصادية (الرقم الأخضر 1020)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-950 text-slate-400 hover:text-white border border-red-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Advisory */}
        <div className="my-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 text-red-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            حماية كاملة وهوية مشفرة للمبلّغ:
          </p>
          وفقاً لقانون 15-21، يتم التعامل مع البلاغات بسرية تامة وتوجيه فرق الرقابة والدرك الوطني للمعاينة الميدانية ومصادرة المحاصيل غير المصرح بها وضخها في السوق.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المادة أو المحصول المشتبه فيه *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-white text-xs focus:border-red-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الولاية وموقع المخالفة *
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-white text-xs focus:border-red-400 focus:outline-none"
              >
                {ALGERIAN_WILAYAS_LIST.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                السعر المرصود غير القانوني (د.ج / كغ) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={priceSpotted}
                onChange={(e) => setPriceSpotted(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-500 text-red-300 font-bold font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم المحل / المستودع أو صفة الوسيط
              </label>
              <input
                type="text"
                value={wholesalerStoreName}
                onChange={(e) => setWholesalerStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-white text-xs focus:border-red-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              تفاصيل إضافية عن الواقعة وطرق تخزين البضاعة *
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-white text-xs focus:border-red-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-red-500/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال البلاغ لفرق التدخل الفوري</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
