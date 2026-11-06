export type Role = 'farmer' | 'wholesaler' | 'state' | 'analytics' | 'control_room';

export interface PriceViolationAlert {
  id: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  cropId: number;
  cropName: string;
  wilaya: string;
  attemptedPrice: number;
  maxLegalPrice: number;
  minFloorPrice: number;
  excessPercentage: string;
  status: 'unresolved' | 'investigated' | 'penalized' | 'frozen';
  timestamp: string;
  actionTaken?: string;
  notes?: string;
}

export interface ACIDExecutionLog {
  id: string;
  step: string;
  status: 'info' | 'success' | 'danger' | 'warning';
  sqlSnippet: string;
  details: string;
  timestamp: string;
}

export type CropCategory = 
  | 'خضروات'
  | 'حبوب وبقوليات'
  | 'فواكه'
  | 'تمور'
  | 'حمضيات';

export type CropStatus = 
  | 'available' 
  | 'in_bidding' 
  | 'purchased_by_state' 
  | 'purchased_by_wholesaler';

export interface WholesalerOffer {
  id: string;
  wholesalerName: string;
  companyName: string;
  taxNumber: string;
  wilaya: string;
  offeredPricePerKg: number;
  requestedQuantityTons: number;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
  phone: string;
  deliveryDate: string;
}

export interface StatePurchaseRecord {
  id: string;
  cooperativeName: string; // e.g. "SARPA - الشركة الجزائرية لضبط المنتجات الفلاحية"
  officerName: string;
  purchasePricePerKg: number;
  totalQuantityTons: number;
  totalAmountDZD: number;
  purchaseDate: string;
  siloDestination: string; // e.g. "مستودعات التبريد المركزية - بوفاريك"
  transactionRef: string;
  certificateNumber: string;
  subsidyGrantedDZD: number;
}

export interface CropListing {
  id: string;
  title: string;
  category: CropCategory;
  variety: string; // الصنف: مثلاً بطاطا سبونتا، طماطم حقلية، قمح صلب سيميتو
  wilaya: string; // الولاية
  commune: string; // البلدية
  farmerName: string;
  farmerPhone: string;
  nationalFarmerCardId: string; // رقم بطاقة الفلاح المهنية
  farmName: string;
  availableQuantityTons: number;
  minOrderTons: number;
  harvestDate: string;
  actualCostPerKg: number; // التكلفة الحقيقية للكيلوغرام د.ج
  proposedPricePerKg: number; // السعر المقترح من الفلاح د.ج
  statutoryCeilingPricePerKg: number; // السقف القانوني المحدد للدولة د.ج
  qualityGrade: 'الدرجة الأولى الممتازة (Extra)' | 'الدرجة الأولى (I)' | 'الدرجة الثانية (II)';
  packagingType: 'صناديق خشبية مبردة' | 'أكياس خيش معتمدة' | 'صناديق بلاستيكية قياسية' | 'حمولة صب (Bulk)';
  status: CropStatus;
  statePurchased: boolean;
  statePurchaseDetails?: StatePurchaseRecord;
  wholesalerOffers: WholesalerOffer[];
  imageUrl: string;
  notes?: string;
  isStrategicCommodity: boolean; // مادة ذات استهلاك واسع
  createdAt: string;
}

export interface PriceCeilingRule {
  id: string;
  cropName: string;
  category: CropCategory;
  maxLegalPricePerKg: number; // السقف القانوني الإلزامي د.ج
  recommendedFloorPricePerKg: number; // السعر المرجعي الأدنى لحماية الفلاح د.ج
  currentMarketAverageDZD: number; // متوسط سعر السوق الحر د.ج
  unit: string;
  legalDecreeRef: string; // المرسوم التنفيذي الوزاري
  lastUpdated: string;
  isStrategic: boolean;
  supportSubsidyPerKg: number; // قيمة الدعم التكميلي للدولة
}

export interface WilayaSupplyBalance {
  wilayaCode: string;
  wilayaName: string;
  primaryCrops: string[];
  status: 'surplus' | 'balanced' | 'deficit';
  surplusDeficitTons: number;
  majorCrop: string;
  storageCapacityUtilizationPercent: number;
}

export interface MarketAlert {
  id: string;
  cropName: string;
  wilaya: string;
  type: 'speculation_risk' | 'deficit_warning' | 'surplus_overflow' | 'price_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface OfficialContract {
  id: string;
  listingId: string;
  cropTitle: string;
  buyerType: 'state' | 'wholesaler';
  buyerName: string;
  buyerEntity: string;
  sellerFarmerName: string;
  sellerCardId: string;
  wilayaSource: string;
  destination: string;
  quantityTons: number;
  pricePerKg: number;
  totalAmountDZD: number;
  contractDate: string;
  contractNumber: string;
  qrCodeToken: string;
  legalStatus: 'معتمد رسمياً' | 'قيد الشحن' | 'تم الاستلام والتفريغ';
}
