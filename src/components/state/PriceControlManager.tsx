import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { PriceCeilingRule } from '../../types';
import { 
  Scale, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  TrendingDown, 
  AlertTriangle, 
  FileText,
  Sparkles
} from 'lucide-react';

export const PriceControlManager: React.FC = () => {
  const { priceCeilings, updatePriceCeiling } = useMarket();

  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [floorPrice, setFloorPrice] = useState<number>(0);
  const [subsidy, setSubsidy] = useState<number>(0);
  const [decreeRef, setDecreeRef] = useState('');

  const handleStartEdit = (rule: PriceCeilingRule) => {
    setEditingRuleId(rule.id);
    setMaxPrice(rule.maxLegalPricePerKg);
    setFloorPrice(rule.recommendedFloorPricePerKg);
    setSubsidy(rule.supportSubsidyPerKg);
    setDecreeRef(rule.legalDecreeRef);
  };

  const handleSave = (ruleId: string) => {
    updatePriceCeiling(ruleId, Number(maxPrice), Number(floorPrice), decreeRef, Number(subsidy));
    setEditingRuleId(null);
  };

  const handleCancel = () => {
    setEditingRuleId(null);
  };

  return (
    <div className="space-y-4">
      {/* Informative Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-emerald-950/60 to-slate-900 border border-amber-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              لوحة التحكم المركزية في تسقيف وضبط الأسعار (ديوان ضبط الإنتاج الفلاحي)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                صلاحيات سيادية مباشرة
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              تعديل السقف السعري هنا يُعمّم فورياً على كافة الفلاحين والوسطاء، ويعيد برمجة ضوابط التحقق من الصفقات في جميع أنحاء التراب الوطني.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="glass-card rounded-2xl border border-emerald-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-emerald-950/80 border-b border-emerald-500/20 text-slate-300 font-bold">
              <tr>
                <th className="py-3 px-4">المادة الفلاحية</th>
                <th className="py-3 px-4">الشعبة</th>
                <th className="py-3 px-4">السقف القانوني الأقصى</th>
                <th className="py-3 px-4">السعر المرجعي الأدنى</th>
                <th className="py-3 px-4">دعم الدولة التكميلي</th>
                <th className="py-3 px-4">المرسوم / المقرر التنفيذي</th>
                <th className="py-3 px-4">آخر تحيين</th>
                <th className="py-3 px-4 text-center">الإجراء السيادي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {priceCeilings.map((rule) => {
                const isEditing = editingRuleId === rule.id;

                return (
                  <tr 
                    key={rule.id}
                    className={`transition-colors hover:bg-emerald-950/30 ${
                      isEditing ? 'bg-amber-950/30' : ''
                    }`}
                  >
                    {/* Crop Name */}
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{rule.cropName}</span>
                      {rule.isStrategic && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono">
                          استراتيجي
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {rule.category}
                    </td>

                    {/* Max Legal Price */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-slate-900 border border-amber-400 text-amber-300 rounded font-bold font-mono text-xs focus:outline-none"
                          />
                          <span className="text-slate-400 text-[11px]">{rule.unit}</span>
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-amber-400 text-sm bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {rule.maxLegalPricePerKg} {rule.unit}
                        </span>
                      )}
                    </td>

                    {/* Floor Price */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          step="0.5"
                          value={floorPrice}
                          onChange={(e) => setFloorPrice(Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-900 border border-emerald-400 text-emerald-300 rounded font-bold font-mono text-xs focus:outline-none"
                        />
                      ) : (
                        <span className="font-mono text-slate-300">
                          {rule.recommendedFloorPricePerKg} {rule.unit}
                        </span>
                      )}
                    </td>

                    {/* State Subsidy */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={subsidy}
                          onChange={(e) => setSubsidy(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-900 border border-cyan-400 text-cyan-300 rounded font-bold font-mono text-xs focus:outline-none"
                        />
                      ) : (
                        <span className="font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                          +{rule.supportSubsidyPerKg} دج
                        </span>
                      )}
                    </td>

                    {/* Decree Ref */}
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={decreeRef}
                          onChange={(e) => setDecreeRef(e.target.value)}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 text-white rounded text-xs focus:outline-none"
                        />
                      ) : (
                        <span title={rule.legalDecreeRef}>{rule.legalDecreeRef}</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {rule.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSave(rule.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            title="حفظ وتعميم السقف فوراً"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="إلغاء التعديل"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(rule)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>تعديل السقف</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
