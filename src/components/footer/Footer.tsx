import React from 'react';
import { Scale, PhoneCall, ShieldCheck, Landmark, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-emerald-500/20 bg-gradient-to-b from-[#041610] to-[#020b08] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold shadow">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">سوق المحصول</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              المنصة الرقمية الوطنية المعتمدة لضبط وتسقيف الأسعار الزراعية في الجزائر، والربط الشفاف بين الفلاح وتجار الجملة والتعاونيات العمومية لحماية القدرة الشرائية ودعم الإنتاج المحلي.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>خاضعة لإشراف وزارة الفلاحة والتنمية الريفية</span>
            </div>
          </div>

          {/* Col 2: Institutional Partners */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">الهيئات والدواوين الشريكة</h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>الديوان الوطني المهني المشترك للخضر واللحوم (ONILEV)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>الديوان الجزائري المهني للحبوب (OAIC - تعاونيات CCLS)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>الغرفة الوطنية للفلاحة والغرف الفلاحية الولائية (58 ولاية)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Regulatory Reference */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">الإطار القانوني والتنظيمي</h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>قانون رقم 15-21 المتعلق بمكافحة المضاربة غير المشروعة</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>نظام الضبط وتكوين المخزونات الأمنية (SYRPALAC)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>المراسيم التنفيذية المحددة لأسقف وهوامش الربح للمنتجات واسعة الاستهلاك</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Anti-Speculation Hotline */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">خلية التبليغ واليقظة الاقتصادية</h4>
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>الرقم الأخضر المجاني: 1020</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                متاح 24/7 للتبليغ عن أي زيادة غير قانونية في الأسعار، حجب السلع، أو الاحتكار غير المشروع للمحاصيل الزراعية.
              </p>
            </div>
            <p className="text-[10px] text-slate-500">
              جميع التداولات عبر المنصة مسجلة ومحمية بالبصمة الرقمية المعتمدة.
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 الجمهورية الجزائرية الديمقراطية الشعبية - وزارة الفلاحة والتنمية الريفية. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>النسخة الوطنية الموحدة v2.4</span>
            <span>•</span>
            <span>سيرفرات البيانات الوطنية الموطنة بالجزائر</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
