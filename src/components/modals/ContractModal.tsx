import React from 'react';
import { OfficialContract } from '../../types';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Landmark, 
  CheckCircle2, 
  FileCheck,
  Building,
  Calendar,
  MapPin
} from 'lucide-react';

interface ContractModalProps {
  contract: OfficialContract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ contract, isOpen, onClose }) => {
  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
  };

  const isState = contract.buyerType === 'state';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:m-0 print:shadow-none print:w-full border-4 border-emerald-800">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>معاينة الوثيقة الرسمية الصادرة عن المنظومة الوطنية</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السند / تحميل PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Body */}
        <div className="space-y-6 text-right font-['Cairo',sans-serif]" dir="rtl">
          
          {/* Official Republic Header */}
          <div className="text-center space-y-1 border-b-2 border-emerald-900 pb-4">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800">
              <span>🇩🇿 الجمهورية الجزائرية الديمقراطية الشعبية 🇩🇿</span>
            </div>
            <h2 className="text-base font-black text-emerald-950">
              وزارة الفلاحة والتنمية الريفية | وزارة التجارة وترقية الصادرات
            </h2>
            <p className="text-xs text-slate-600 font-semibold">
              الديوان الوطني لضبط المنتجات الفلاحية • المنصة الرقمية "سوق المحصول"
            </p>
            <div className="inline-block mt-2 px-4 py-1 rounded bg-emerald-900 text-amber-300 font-black text-sm tracking-wide">
              {isState ? 'شهادة شراء سيادي وتأمين المخزون الاستراتيجي الوطني' : 'سند شحن ورخصة نقل منتوجات فلاحية مقننة'}
            </div>
          </div>

          {/* Reference & Barcode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[11px]">رقم السند المعتمد:</span>
              <strong className="text-emerald-900 text-sm">{contract.contractNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">تاريخ التحرير والتسجيل:</span>
              <strong className="text-slate-800">{contract.contractDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">الوضعية القانونية:</span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                {contract.legalStatus}
              </span>
            </div>
          </div>

          {/* Parties: Seller & Buyer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Seller */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
              <h4 className="font-black text-emerald-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <span>الطرف الأول: الفلاح المنتِج (المورّد)</span>
              </h4>
              <p><span className="text-slate-500">الاسم واللقب:</span> <strong>{contract.sellerFarmerName}</strong></p>
              <p><span className="text-slate-500">رقم بطاقة الفلاح:</span> <strong className="font-mono">{contract.sellerCardId}</strong></p>
              <p><span className="text-slate-500">موقع الإنتاج:</span> <strong>{contract.wilayaSource}</strong></p>
              <p><span className="text-slate-500">حالة المستحقات:</span> <strong className="text-emerald-700">مضمونة 100%</strong></p>
            </div>

            {/* Buyer */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
              <h4 className="font-black text-emerald-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <span>الطرف الثاني: الجهة المشترية ({isState ? 'هيئة عمومية' : 'تاجر جملة معتمد'})</span>
              </h4>
              <p><span className="text-slate-500">الاسم / الهيئة:</span> <strong>{contract.buyerName}</strong></p>
              <p><span className="text-slate-500">الصفة الرسمية:</span> <strong>{contract.buyerEntity}</strong></p>
              <p><span className="text-slate-500">وجهة التفريغ:</span> <strong>{contract.destination}</strong></p>
              <p><span className="text-slate-500">طبيعة العقد:</span> <strong className="text-amber-800">{isState ? 'شراء سيادي لدعم التوازن' : 'شراء جملة مقنن'}</strong></p>
            </div>
          </div>

          {/* Cargo Details Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-emerald-900 text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">بيان المحصول</th>
                  <th className="py-2.5 px-3">الكمية بالطن</th>
                  <th className="py-2.5 px-3">الكمية بالقنطار</th>
                  <th className="py-2.5 px-3">سعر الكيلوغرام</th>
                  <th className="py-2.5 px-3">المبلغ الإجمالي المفوتر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">{contract.cropTitle}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-900">{contract.quantityTons} طن</td>
                  <td className="py-3 px-3 font-mono">{(contract.quantityTons * 10).toLocaleString()} قنطار</td>
                  <td className="py-3 px-3 font-mono font-bold">{contract.pricePerKg} د.ج / كغ</td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-950 text-sm">
                    {contract.totalAmountDZD.toLocaleString()} د.ج
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal Protection Statement */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1 leading-relaxed">
            <p className="font-bold">سند قانوني ملزم للمصالح الأمنية والرقابية (الدرك الوطني، الأمن الوطني، ومفتشيات قمع الغش):</p>
            <p className="text-[11px]">
              هذه الشحنة مسجلة رسمياً ضمن المنصة الوطنية الرقمية لضبط الأسعار وتخضع للسقف السعري المحدد بموجب المراسيم التنفيذية المعمول بها. يمنح هذا السند لحامله رخصة تنقل وتفريغ قانونية على كامل التراب الوطني، ولا يجوز توقيفها أو حجزها طالما كانت مطابقة للبيانات الواردة أعلاه.
            </p>
          </div>

          {/* Seal & Signatures Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-slate-200 text-center text-xs">
            {/* Signature Seller */}
            <div className="space-y-8">
              <span className="font-bold text-slate-700 block">توقيع وختم الفلاح المنتِج</span>
              <div className="font-serif italic text-emerald-800 text-sm font-bold">
                {contract.sellerFarmerName}
              </div>
            </div>

            {/* QR Code Stamp */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">التحقق الرقمي الفوري</span>
            </div>

            {/* Republic Seal */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center text-emerald-900 p-1">
                <span className="text-[9px] font-black leading-tight">الجمهورية الجزائرية</span>
                <span className="text-[8px] font-bold text-red-600">★ 🇩🇿 ★</span>
                <span className="text-[8px] font-bold">ديوان الضبط الفلاحي</span>
              </div>
              <span className="text-[10px] text-slate-500">خاتم المطابقة السيادية</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
