import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { AddCropModal } from './AddCropModal';
import { StatsCard } from '../common/StatsCard';
import { CropListing } from '../../types';
import { 
  PlusCircle, 
  Tractor, 
  Landmark, 
  ShieldCheck, 
  Coins, 
  MapPin, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  ExternalLink,
  PhoneCall,
  Clock,
  Building2,
  FileBadge
} from 'lucide-react';

export const FarmerPortal: React.FC = () => {
  const { 
    crops, 
    acceptWholesalerOffer, 
    executeSovereignPurchase, 
    setSelectedContractForModal,
    contracts 
  } = useMarket();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Summary Metrics
  const totalCropsCount = crops.length;
  const statePurchasedCrops = crops.filter(c => c.statePurchased);
  const totalStatePurchasedTons = statePurchasedCrops.reduce((acc, c) => acc + c.availableQuantityTons, 0);
  
  const totalRevenueDZD = crops.reduce((acc, c) => {
    if (c.statePurchased && c.statePurchaseDetails) {
      return acc + c.statePurchaseDetails.totalAmountDZD;
    }
    const acceptedOffer = c.wholesalerOffers.find(o => o.status === 'accepted');
    if (acceptedOffer) {
      return acc + (acceptedOffer.offeredPricePerKg * acceptedOffer.requestedQuantityTons * 1000);
    }
    return acc;
  }, 0);

  const pendingOffersCount = crops.reduce((acc, c) => 
    acc + c.wholesalerOffers.filter(o => o.status === 'pending').length, 0
  );

  const filteredCrops = crops.filter(c => {
    if (filterStatus === 'available' && c.status !== 'available') return false;
    if (filterStatus === 'state_bought' && !c.statePurchased) return false;
    if (filterStatus === 'in_bidding' && c.status !== 'in_bidding') return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenContractForCrop = (crop: CropListing) => {
    const foundContract = contracts.find(ct => ct.listingId === crop.id);
    if (foundContract) {
      setSelectedContractForModal(foundContract);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-[#06291e] to-emerald-950 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs text-emerald-300 font-bold">
              <Tractor className="w-4 h-4 text-amber-400" />
              <span>فضاء الفلاح والمنتج الزراعي المعتمد</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              مرحباً بك في البورصة الرقمية لضبط الأسعار وسلاسل التوزيع
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              اعرض محاصيلك بشفافية، تتبع تكاليف الإنتاج، واستفد من آلية الشراء السيادي الفوري من طرف دواوين الدولة (SARPA / ONILEV / OAIC) لحماية محاصيلك وتأمين مستحقاتك المالية بضمان الخزينة العمومية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 gold-glow cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>إضافة محصول جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي المحاصيل المسجلة"
          value={totalCropsCount}
          subtitle="محصول مسجل بالبوابة"
          icon={<Layers className="w-6 h-6" />}
          accentColor="emerald"
        />
        <StatsCard
          title="شراء سيادي مباشر للدولة"
          value={`${totalStatePurchasedTons.toLocaleString()} طن`}
          subtitle={`${statePurchasedCrops.length} شحنات مدعومة بالكامل`}
          icon={<Landmark className="w-6 h-6" />}
          accentColor="gold"
          trend={{ value: 'ضمان الدفع 100%', isPositive: true, label: 'خزينة عمومية' }}
        />
        <StatsCard
          title="إجمالي المداخيل المسجلة"
          value={`${(totalRevenueDZD / 1000000).toFixed(2)} مليون د.ج`}
          subtitle={`${totalRevenueDZD.toLocaleString()} دج تدفقات نقدية`}
          icon={<Coins className="w-6 h-6" />}
          accentColor="amber"
        />
        <StatsCard
          title="عروض تجار الجملة الواردة"
          value={pendingOffersCount}
          subtitle="عروض في انتظار الموافقة"
          icon={<Truck className="w-6 h-6" />}
          accentColor="blue"
        />
      </div>

      {/* Direct Supply Contract with State Cooperatives Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-emerald-950/60 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <FileBadge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              عقود التوريد المباشر مع التعاونيات العمومية (CCLS / SARPA / ONILEV)
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                متاح الآن
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              يمكنك طلب تدخل التعاونية العمومية لشراء محصولك مباشرة بسعر السقف المحدد، مع الإعفاء من رسوم الوسطاء وضمان استلام المقابل المالي خلال 48 ساعة.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950/70 p-3 rounded-xl border border-emerald-500/20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === 'all' 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-emerald-950'
            }`}
          >
            جميع المحاصيل ({crops.length})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === 'available' 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-emerald-950'
            }`}
          >
            المعروضة للبيع ({crops.filter(c => c.status === 'available').length})
          </button>
          <button
            onClick={() => setFilterStatus('state_bought')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === 'state_bought' 
                ? 'bg-amber-500 text-slate-950' 
                : 'text-slate-400 hover:text-white hover:bg-emerald-950'
            }`}
          >
            تم الشراء السيادي للدولة ({statePurchasedCrops.length})
          </button>
          <button
            onClick={() => setFilterStatus('in_bidding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === 'in_bidding' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-emerald-950'
            }`}
          >
            طلبات تجار الجملة ({crops.filter(c => c.status === 'in_bidding').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">الشعبة:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">كل الشعب</option>
            <option value="خضروات">خضروات</option>
            <option value="حبوب وبقوليات">حبوب وبقوليات</option>
            <option value="فواكه">فواكه</option>
            <option value="تمور">تمور</option>
            <option value="حمضيات">حمضيات</option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCrops.map((crop) => {
          const isStatePurchased = crop.statePurchased;
          const ceiling = crop.statutoryCeilingPricePerKg;
          const proposed = crop.proposedPricePerKg;
          const cost = crop.actualCostPerKg;
          const margin = proposed - cost;
          const totalVal = proposed * crop.availableQuantityTons * 1000;

          return (
            <div
              key={crop.id}
              className={`glass-card rounded-2xl border overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between ${
                isStatePurchased
                  ? 'border-amber-500/50 bg-gradient-to-b from-[#0a2f20] to-[#041910] gold-glow'
                  : 'border-emerald-500/20 hover:border-emerald-500/50'
              }`}
            >
              {/* Top Banner / Image Header */}
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={crop.imageUrl}
                    alt={crop.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04150f] via-black/40 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 right-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                      {crop.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-slate-200 border border-slate-700 backdrop-blur-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {crop.wilaya}
                    </span>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    {isStatePurchased ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-lg flex items-center gap-1.5 border border-amber-300">
                        <Landmark className="w-3.5 h-3.5" />
                        تم الشراء السيادي للدولة
                      </span>
                    ) : crop.status === 'in_bidding' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        عروض تجار الجملة ({crop.wholesalerOffers.length})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        معروض ومطابق للسقف
                      </span>
                    )}
                  </div>

                  {/* Quantity and Harvest bottom tag */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold text-amber-300 text-sm bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {crop.availableQuantityTons} طن ({crop.availableQuantityTons * 10} قنطار)
                    </span>
                    <span className="text-slate-300 bg-black/50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      جني: {crop.harvestDate}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {crop.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {crop.notes || 'محصول معتمد من مستثمرات الإنتاج الوطني خاضع للرقابة النوعية.'}
                    </p>
                  </div>

                  {/* Farmer Info */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Tractor className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{crop.farmerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{crop.nationalFarmerCardId}</p>
                      </div>
                    </div>
                    <div className="text-left text-slate-300 font-mono text-xs flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      <span>{crop.farmerPhone}</span>
                    </div>
                  </div>

                  {/* Price & Ceiling Barometer */}
                  <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">التكلفة الفعلية للكيلوغرام:</span>
                      <span className="font-bold font-mono text-slate-300">{cost} د.ج</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">سعر البيع المقترح:</span>
                      <span className="font-black font-mono text-base text-emerald-300">{proposed} د.ج / كغ</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-500/20">
                      <span className="text-amber-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        السقف السعري للدولة:
                      </span>
                      <span className="font-bold font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        {ceiling} د.ج / كغ
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>صافي هامش الربح:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        +{margin.toFixed(1)} د.ج ({((margin / cost) * 100).toFixed(0)}%)
                      </span>
                      <span>القيمة الإجمالية:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {totalVal.toLocaleString()} د.ج
                      </span>
                    </div>
                  </div>

                  {/* If State Purchased: Details Box */}
                  {isStatePurchased && crop.statePurchaseDetails && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 to-emerald-950/60 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Landmark className="w-3.5 h-3.5" />
                          الجهة المشترية:
                        </span>
                        <span className="text-white font-semibold">{crop.statePurchaseDetails.cooperativeName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">مستودع التخزين الاستراتيجي:</span>
                        <span className="text-slate-200 text-[11px]">{crop.statePurchaseDetails.siloDestination}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">المبلغ الإجمالي المضمون:</span>
                        <span className="text-amber-400 font-mono font-bold text-sm">
                          {crop.statePurchaseDetails.totalAmountDZD.toLocaleString()} د.ج
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenContractForCrop(crop)}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <FileBadge className="w-4 h-4" />
                        <span>طباعة ومعاينة سند الشحن وشهادة الدفع السيادية</span>
                      </button>
                    </div>
                  )}

                  {/* Wholesaler Offers Section */}
                  {!isStatePurchased && crop.wholesalerOffers.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-emerald-500/20">
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        عروض الشراء المقدمة من تجار الجملة ({crop.wholesalerOffers.length}):
                      </h4>
                      {crop.wholesalerOffers.map((offer) => (
                        <div 
                          key={offer.id} 
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{offer.companyName} ({offer.wholesalerName})</span>
                            <span className="text-amber-400 font-mono font-bold">{offer.offeredPricePerKg} د.ج/كغ</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>الكمية المطلوبة: {offer.requestedQuantityTons} طن</span>
                            <span>الوجهة: {offer.wilaya}</span>
                            <span>التسليم: {offer.deliveryDate}</span>
                          </div>
                          {offer.status === 'pending' ? (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => acceptWholesalerOffer(crop.id, offer.id)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                قبول وتوقيع العقد الرسمي
                              </button>
                            </div>
                          ) : offer.status === 'accepted' ? (
                            <div className="flex items-center justify-between text-emerald-400 font-bold bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                              <span>✓ تم قبول العقد وإصدار رخصة النقل</span>
                              <button
                                onClick={() => handleOpenContractForCrop(crop)}
                                className="text-amber-300 underline text-[11px] flex items-center gap-1"
                              >
                                عرض السند
                              </button>
                            </div>
                          ) : (
                            <div className="text-red-400 text-[11px]">تم رفض هذا العرض</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="p-4 bg-slate-950/80 border-t border-emerald-500/15 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  {crop.packagingType}
                </span>

                {!isStatePurchased && (
                  <button
                    onClick={() => {
                      executeSovereignPurchase(
                        crop.id, 
                        'الشركة الجزائرية لضبط المنتجات الفلاحية (SARPA)', 
                        'مجمع التبريد والتخزين الاستراتيجي المركزي',
                        crop.proposedPricePerKg
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                    title="طلب الشراء السيادي الفوري من طرف ديوان الضبط الفلاحي"
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>طلب شراء سيادي فوري</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCrops.length === 0 && (
        <div className="glass-card p-12 rounded-2xl border border-emerald-500/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <Tractor className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد محاصيل تطابق هذا التصنيف</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            قم بإضافة محصولك الزراعي وتحديد تكاليفك وسعر البيع المقترح للاستفادة من تسويق فوري وآمن.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة أول محصول الآن</span>
          </button>
        </div>
      )}

      {/* Add Crop Modal */}
      <AddCropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
