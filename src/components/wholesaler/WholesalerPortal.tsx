import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { CropListing } from '../../types';
import { WholesalerOrderModal } from './WholesalerOrderModal';
import { StatsCard } from '../common/StatsCard';
import { ALGERIAN_WILAYAS_LIST } from '../../data/mockData';
import { 
  Truck, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Package, 
  Clock, 
  Tractor, 
  Calendar,
  Building,
  Sparkles,
  Layers,
  FileBadge
} from 'lucide-react';

export const WholesalerPortal: React.FC = () => {
  const { crops, contracts, setSelectedContractForModal } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'market' | 'my_contracts'>('market');
  const [selectedCropForOrder, setSelectedCropForOrder] = useState<CropListing | null>(null);

  // Filter available crops
  const availableCrops = crops.filter(c => {
    if (c.status === 'purchased_by_state') return false; // Filter out sovereign buys from open wholesale market
    
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchVariety = c.variety.toLowerCase().includes(q);
      const matchWilaya = c.wilaya.toLowerCase().includes(q);
      const matchFarmer = c.farmerName.toLowerCase().includes(q);
      if (!matchTitle && !matchVariety && !matchWilaya && !matchFarmer) return false;
    }

    // Wilaya filter
    if (selectedWilaya !== 'all' && !c.wilaya.includes(selectedWilaya.split(' ')[0])) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && c.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Wholesaler's confirmed contracts
  const wholesalerContracts = contracts.filter(c => c.buyerType === 'wholesaler');

  return (
    <div className="space-y-6">
      {/* Wholesaler Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#1a1c14] to-emerald-950 border border-amber-500/30 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full text-xs text-amber-300 font-bold">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>فضاء تاجر الجملة ومؤسسات التوزيع المعتمدة</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              سوق الجملة الوطني المباشر للمحاصيل المقننة
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              اشترِ مباشرة من الفلاحين دون وسطاء ضمن السقف السعري القانوني. كل معاملة على المنصة تمنحك تلقائياً <strong className="text-amber-300">سند شحن ورخصة نقل إلكترونية معتمدة</strong> تحميك من أي حجز أو مخالفات رقابية أثناء النقل بين الولايات.
            </p>
          </div>

          {/* Quick Tabs Switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-amber-500/30 shrink-0">
            <button
              onClick={() => setActiveTab('market')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'market'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>سوق المحاصيل المتاحة ({availableCrops.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('my_contracts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'my_contracts'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileBadge className="w-4 h-4" />
              <span>سندات الشحن ورخص النقل ({wholesalerContracts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="شحنات متاحة للطلب الفوري"
          value={`${availableCrops.reduce((acc, c) => acc + c.availableQuantityTons, 0).toLocaleString()} طن`}
          subtitle={`${availableCrops.length} عروض جاهزة للشحن`}
          icon={<Package className="w-6 h-6" />}
          accentColor="amber"
        />
        <StatsCard
          title="سندات الشحن الصادرة"
          value={wholesalerContracts.length}
          subtitle="عقود معتمدة قانونياً"
          icon={<FileText className="w-6 h-6" />}
          accentColor="emerald"
          trend={{ value: '100% موثقة', isPositive: true, label: 'رقم جبائي وسجل معتمد' }}
        />
        <StatsCard
          title="متوسط الالتزام بالسقف السعري"
          value="100%"
          subtitle="انعدام المضاربة غير المشروعة"
          icon={<ShieldCheck className="w-6 h-6" />}
          accentColor="gold"
        />
        <StatsCard
          title="تغطية الولايات الزراعية"
          value="58 ولاية"
          subtitle="ربط مباشر مع غرف الفلاحة"
          icon={<MapPin className="w-6 h-6" />}
          accentColor="blue"
        />
      </div>

      {activeTab === 'market' ? (
        <>
          {/* Search & Filter Toolbar */}
          <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالمنتوج، الصنف، الفلاح، أو الولاية..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white placeholder-slate-500 text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Wilaya Filter */}
              <div>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="all">📍 جميع الولايات (58 ولاية)</option>
                  {ALGERIAN_WILAYAS_LIST.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="all">🌾 كل الشعب الفلاحية</option>
                  <option value="خضروات">خضروات</option>
                  <option value="حبوب وبقوليات">حبوب وبقوليات</option>
                  <option value="فواكه">فواكه</option>
                  <option value="تمور">تمور</option>
                  <option value="حمضيات">حمضيات</option>
                </select>
              </div>
            </div>
          </div>

          {/* Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCrops.map((crop) => {
              const ceiling = crop.statutoryCeilingPricePerKg;
              const proposed = crop.proposedPricePerKg;
              const savingsUnderCeiling = ceiling - proposed;

              return (
                <div
                  key={crop.id}
                  className="glass-card rounded-2xl border border-emerald-500/20 hover:border-amber-400/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={crop.imageUrl}
                        alt={crop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent" />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                          {crop.category}
                        </span>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/90 text-slate-950 border border-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          مطابق للسقف
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-xs text-white">
                        <span className="font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded">
                          {crop.availableQuantityTons} طن متاح
                        </span>
                        <span className="text-slate-300 bg-black/50 px-2 py-0.5 rounded flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {crop.wilaya}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                          {crop.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {crop.notes}
                        </p>
                      </div>

                      {/* Producer info */}
                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/15 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{crop.farmerName}</p>
                          <p className="text-[10px] text-slate-400">{crop.farmName}</p>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          بطاقة فلاح معتمدة
                        </span>
                      </div>

                      {/* Pricing block */}
                      <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">سعر الفلاح المطلوب:</span>
                          <span className="text-base font-black font-mono text-emerald-400">
                            {proposed} د.ج / كغ
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-500/20">
                          <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                            <ShieldCheck className="w-3 h-3" />
                            سقف الدولة القانوني:
                          </span>
                          <span className="font-bold font-mono text-amber-300 text-xs">
                            {ceiling} د.ج / كغ
                          </span>
                        </div>
                        {savingsUnderCeiling > 0 && (
                          <p className="text-[10px] text-emerald-400">
                            ✓ أقل من السقف بـ {savingsUnderCeiling} د.ج/كغ (هامش ترويجي ممتاز)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-4 bg-slate-950/90 border-t border-emerald-500/15">
                    <button
                      onClick={() => setSelectedCropForOrder(crop)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer gold-glow"
                    >
                      <Truck className="w-4 h-4" />
                      <span>تقديم طلب شراء ورخصة نقل</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {availableCrops.length === 0 && (
            <div className="glass-card p-12 rounded-2xl border border-emerald-500/20 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">لا توجد محاصيل تطابق معايير البحث</h3>
              <p className="text-xs text-slate-400">يرجى تعديل الفلترة أو تفريغ كلمات البحث لمعاينة الشحنات المتاحة.</p>
            </div>
          )}
        </>
      ) : (
        /* My Contracts & Waybills Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileBadge className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">سجل سندات الشحن ورخص التنقل التجاري</h3>
                <p className="text-xs text-slate-300">
                  العقود الموقعة عبر المنصة مع الفلاحين تحمل رمز QR المعتمد من وزارة الفلاحة والتجارة لحماية الشاحنات من الحجز.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wholesalerContracts.map((contract) => (
              <div 
                key={contract.id}
                className="glass-card p-5 rounded-2xl border border-amber-500/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">
                      رقم السند: {contract.contractNumber}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{contract.cropTitle}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {contract.legalStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">الفلاح المورّد:</span>
                    <span className="text-white font-semibold">{contract.sellerFarmerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">الكمية المشحونة:</span>
                    <span className="text-amber-400 font-mono font-bold">{contract.quantityTons} طن</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">سعر الكيلوغرام:</span>
                    <span className="text-emerald-400 font-mono font-bold">{contract.pricePerKg} د.ج / كغ</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">القيمة الإجمالية:</span>
                    <span className="text-white font-mono font-bold">{contract.totalAmountDZD.toLocaleString()} د.ج</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ولاية الانطلاق:</span>
                    <span className="text-slate-200">{contract.wilayaSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ولاية الوجهة:</span>
                    <span className="text-slate-200">{contract.destination}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">تاريخ التوثيق: {contract.contractDate}</span>
                  <button
                    onClick={() => setSelectedContractForModal(contract)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileBadge className="w-3.5 h-3.5" />
                    <span>طباعة سند الشحن الرسمي</span>
                  </button>
                </div>
              </div>
            ))}

            {wholesalerContracts.length === 0 && (
              <div className="col-span-2 glass-card p-10 rounded-2xl border border-emerald-500/20 text-center space-y-3">
                <Truck className="w-12 h-12 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">لا توجد عقود شراء موثقة حتى الآن</h4>
                <p className="text-xs text-slate-400">
                  تصفح سوق المحاصيل المتاحة وقدم طلبات شراء مع الفلاحين لبناء أسطول شحنك المقنن.
                </p>
                <button
                  onClick={() => setActiveTab('market')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  الانتقال لسوق المحاصيل
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Modal */}
      <WholesalerOrderModal
        crop={selectedCropForOrder}
        isOpen={!!selectedCropForOrder}
        onClose={() => setSelectedCropForOrder(null)}
      />
    </div>
  );
};
