import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Role, 
  CropListing, 
  PriceCeilingRule, 
  WilayaSupplyBalance, 
  MarketAlert, 
  OfficialContract,
  WholesalerOffer,
  PriceViolationAlert,
  ACIDExecutionLog
} from '../types';
import { 
  INITIAL_CROPS, 
  INITIAL_PRICE_CEILINGS, 
  WILAYAS_BALANCE, 
  INITIAL_ALERTS, 
  INITIAL_CONTRACTS,
  INITIAL_VIOLATIONS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface MarketContextType {
  role: Role;
  setRole: (role: Role) => void;
  crops: CropListing[];
  priceCeilings: PriceCeilingRule[];
  wilayaBalances: WilayaSupplyBalance[];
  alerts: MarketAlert[];
  contracts: OfficialContract[];
  violations: PriceViolationAlert[];
  acidLogs: ACIDExecutionLog[];
  isAuthorityRoomConnected: boolean;
  isSoundAlertEnabled: boolean;
  toggleSoundAlert: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Actions
  addCropListing: (newCrop: Omit<CropListing, 'id' | 'createdAt' | 'status' | 'statePurchased' | 'wholesalerOffers'>) => boolean;
  executeSovereignPurchase: (
    cropId: string, 
    cooperativeName: string, 
    siloLocation: string, 
    overridePricePerKg?: number
  ) => boolean;
  submitWholesalerOffer: (
    cropId: string, 
    offer: {
      wholesalerName: string;
      companyName: string;
      taxNumber: string;
      wilaya: string;
      offeredPricePerKg: number;
      requestedQuantityTons: number;
      phone: string;
      deliveryDate: string;
    }
  ) => boolean;
  acceptWholesalerOffer: (cropId: string, offerId: string) => void;
  updatePriceCeiling: (
    ceilingId: string, 
    newMaxLegalPrice: number, 
    newFloorPrice: number, 
    decreeRef: string,
    subsidyPerKg: number
  ) => void;
  reportSpeculation: (data: {
    cropName: string;
    wilaya: string;
    priceSpotted: number;
    notes: string;
    wholesalerStoreName?: string;
  }) => void;
  resolveAlert: (alertId: string) => void;
  freezeUserAccount: (buyerId: string, alertId: string) => void;
  investigateAlert: (alertId: string) => void;
  penalizeAlert: (alertId: string) => void;
  executeACIDSimulation: (
    cropId: string,
    buyerName: string,
    quantity: number,
    price: number,
    isPrivate: boolean,
    wilayaName?: string
  ) => { success: boolean; message: string; alert?: PriceViolationAlert };
  resetData: () => void;
  selectedContractForModal: OfficialContract | null;
  setSelectedContractForModal: (contract: OfficialContract | null) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CROPS = 'souq_mahsool_crops_v1';
const LOCAL_STORAGE_KEY_CEILINGS = 'souq_mahsool_ceilings_v1';
const LOCAL_STORAGE_KEY_CONTRACTS = 'souq_mahsool_contracts_v1';
const LOCAL_STORAGE_KEY_ALERTS = 'souq_mahsool_alerts_v1';
const LOCAL_STORAGE_KEY_VIOLATIONS = 'souq_mahsool_violations_v1';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('farmer');
  
  const [crops, setCrops] = useState<CropListing[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CROPS);
      return saved ? JSON.parse(saved) : INITIAL_CROPS;
    } catch {
      return INITIAL_CROPS;
    }
  });

  const [priceCeilings, setPriceCeilings] = useState<PriceCeilingRule[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CEILINGS);
      return saved ? JSON.parse(saved) : INITIAL_PRICE_CEILINGS;
    } catch {
      return INITIAL_PRICE_CEILINGS;
    }
  });

  const [contracts, setContracts] = useState<OfficialContract[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRACTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
    } catch {
      return INITIAL_CONTRACTS;
    }
  });

  const [alerts, setAlerts] = useState<MarketAlert[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [wilayaBalances] = useState<WilayaSupplyBalance[]>(WILAYAS_BALANCE);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedContractForModal, setSelectedContractForModal] = useState<OfficialContract | null>(null);

  const [violations, setViolations] = useState<PriceViolationAlert[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VIOLATIONS);
      return saved ? JSON.parse(saved) : INITIAL_VIOLATIONS;
    } catch {
      return INITIAL_VIOLATIONS;
    }
  });

  const [acidLogs, setAcidLogs] = useState<ACIDExecutionLog[]>([
    {
      id: 'log-1',
      step: 'POSTGRESQL CONNECTION POOL',
      status: 'success',
      sqlSnippet: 'SELECT pg_isready(); -- PostgreSQL 16.2 / PostGIS Active',
      details: 'الاتصال آمن بقاعدة البيانات مع تفعيل ملحق uuid-ossp وفهارس التسريع.',
      timestamp: 'النظام جاهز',
    }
  ]);

  const [isAuthorityRoomConnected] = useState<boolean>(true);
  const [isSoundAlertEnabled, setIsSoundAlertEnabled] = useState<boolean>(true);

  // Web Audio API Synthesizer for Speculation Alarm
  const playAlertChime = () => {
    if (!isSoundAlertEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Police / Warning 2-tone chime
      playTone(880, 0, 0.18);
      playTone(660, 0.2, 0.22);
      playTone(880, 0.44, 0.25);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const toggleSoundAlert = () => {
    setIsSoundAlertEnabled(prev => !prev);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CROPS, JSON.stringify(crops));
    } catch (e) {
      console.error(e);
    }
  }, [crops]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CEILINGS, JSON.stringify(priceCeilings));
    } catch (e) {
      console.error(e);
    }
  }, [priceCeilings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONTRACTS, JSON.stringify(contracts));
    } catch (e) {
      console.error(e);
    }
  }, [contracts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addCropListing = (newCrop: Omit<CropListing, 'id' | 'createdAt' | 'status' | 'statePurchased' | 'wholesalerOffers'>): boolean => {
    // Check against current statutory ceiling
    const matchingCeiling = priceCeilings.find(c => 
      c.cropName.includes(newCrop.variety) || 
      newCrop.title.includes(c.cropName) ||
      c.category === newCrop.category
    );

    const ceilingLimit = matchingCeiling ? matchingCeiling.maxLegalPricePerKg : newCrop.statutoryCeilingPricePerKg;

    if (newCrop.proposedPricePerKg > ceilingLimit) {
      addToast({
        type: 'error',
        title: 'مخالفة السقف السعري القانوني!',
        message: `السعر المقترح (${newCrop.proposedPricePerKg} د.ج) يتجاوز السقف المحدد من وزارة الفلاحة (${ceilingLimit} د.ج). تم حظر الإدراج وفقاً لقانون حماية المستهلك وقمع المضاربة.`,
      });
      return false;
    }

    const created: CropListing = {
      ...newCrop,
      id: 'crop-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'available',
      statePurchased: false,
      wholesalerOffers: [],
      statutoryCeilingPricePerKg: ceilingLimit,
    };

    setCrops(prev => [created, ...prev]);
    addToast({
      type: 'success',
      title: 'تم إدراج المحصول بنجاح',
      message: `تم التحقق من مطابقة السعر (${created.proposedPricePerKg} د.ج) لسقف الدولة (${ceilingLimit} د.ج). محصولك معروض الآن لتجار الجملة والتعاونيات العمومية.`,
    });
    return true;
  };

  const executeSovereignPurchase = (
    cropId: string, 
    cooperativeName: string, 
    siloLocation: string, 
    overridePricePerKg?: number
  ): boolean => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return false;

    const purchasePrice = overridePricePerKg || crop.proposedPricePerKg;
    const totalAmountDZD = purchasePrice * crop.availableQuantityTons * 1000;
    const certNum = 'CERT-SOV-DZ-' + Math.floor(100000 + Math.random() * 900000);
    const transRef = 'REF-SARPA-' + Date.now().toString().slice(-6);

    const stateRecord = {
      id: 'sp-' + Date.now(),
      cooperativeName,
      officerName: 'المندوب الولائي لديوان الضبط الفلاحي',
      purchasePricePerKg: purchasePrice,
      totalQuantityTons: crop.availableQuantityTons,
      totalAmountDZD,
      purchaseDate: new Date().toLocaleString('ar-DZ'),
      siloDestination: siloLocation,
      transactionRef: transRef,
      certificateNumber: certNum,
      subsidyGrantedDZD: Math.round(totalAmountDZD * 0.1),
    };

    const newContract: OfficialContract = {
      id: 'cont-' + Date.now(),
      listingId: crop.id,
      cropTitle: crop.title,
      buyerType: 'state',
      buyerName: cooperativeName,
      buyerEntity: 'الجمهورية الجزائرية الديمقراطية الشعبية - وزارة الفلاحة والتنمية الريفية',
      sellerFarmerName: crop.farmerName,
      sellerCardId: crop.nationalFarmerCardId,
      wilayaSource: crop.wilaya,
      destination: siloLocation,
      quantityTons: crop.availableQuantityTons,
      pricePerKg: purchasePrice,
      totalAmountDZD,
      contractDate: new Date().toISOString().split('T')[0],
      contractNumber: certNum,
      qrCodeToken: `SOVEREIGN-STATE-BUY-${certNum}`,
      legalStatus: 'معتمد رسمياً',
    };

    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return {
          ...c,
          status: 'purchased_by_state',
          statePurchased: true,
          statePurchaseDetails: stateRecord,
        };
      }
      return c;
    }));

    setContracts(prev => [newContract, ...prev]);

    addToast({
      type: 'success',
      title: 'تم الشراء السيادي الفوري بنجاح! 🇩🇿',
      message: `تدخلت الدولة واشترت الشحنة (${crop.availableQuantityTons} طن) بقيمة ${totalAmountDZD.toLocaleString()} د.ج لصالح ${cooperativeName}. تم إصدار سند الشحن والدفع المضمون للفلاح.`,
    });

    setSelectedContractForModal(newContract);
    return true;
  };

  // Sync violations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_VIOLATIONS, JSON.stringify(violations));
    } catch (e) {
      console.error(e);
    }
  }, [violations]);

  const freezeUserAccount = (buyerId: string, alertId: string) => {
    setViolations(prev => prev.map(v => {
      if (v.id === alertId || v.buyerId === buyerId) {
        return { ...v, status: 'frozen', actionTaken: 'تم تجميد السجل التجاري وحظر المعاملات مؤقتاً' };
      }
      return v;
    }));
    addToast({
      type: 'error',
      title: 'تم تجميد حساب التاجر رسمياً 🚫',
      message: `تم تعليق ترخيص التداول للتاجر وسحب بطاقة الأهلية وفقاً للمادة 12 من قانون مكافحة المضاربة.`,
    });
  };

  const investigateAlert = (alertId: string) => {
    setViolations(prev => prev.map(v => {
      if (v.id === alertId) {
        return { ...v, status: 'investigated', actionTaken: 'تم توجيه فرقة تفتيش وقمع الغش للمعاينة' };
      }
      return v;
    }));
    addToast({
      type: 'warning',
      title: 'إحالة الملف للتحقيق الميداني 🔍',
      message: 'تم إخطار المفتشية الإقليمية للتجارة ومصالح الدرك الوطني للمعاينة والتحري.',
    });
  };

  const penalizeAlert = (alertId: string) => {
    setViolations(prev => prev.map(v => {
      if (v.id === alertId) {
        return { ...v, status: 'penalized', actionTaken: 'تطبيق الغرامة القضائية ومصادرة الشحنة' };
      }
      return v;
    }));
    addToast({
      type: 'info',
      title: 'تطبيق الإجراء الردعي ومصادرة المحصول ⚖️',
      message: 'تم تحرير محضر مخالفة وتوجيه الشحنة مباشرة لمستودعات ديوان SARPA لضخها في السوق.',
    });
  };

  const executeACIDSimulation = (
    cropId: string,
    buyerName: string,
    quantity: number,
    price: number,
    isPrivate: boolean,
    wilayaName?: string
  ): { success: boolean; message: string; alert?: PriceViolationAlert } => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return { success: false, message: 'عروض المحصول غير متاحة أو تم بيعها.' };

    const matchingCeiling = priceCeilings.find(c => 
      c.cropName.includes(crop.variety) || 
      crop.title.includes(c.cropName) ||
      c.category === crop.category
    );

    const maxCeiling = matchingCeiling ? matchingCeiling.maxLegalPricePerKg : crop.statutoryCeilingPricePerKg;
    const minFloor = matchingCeiling ? matchingCeiling.recommendedFloorPricePerKg : 30;

    const timestamp = new Date().toLocaleTimeString('ar-DZ');

    // Case 1: Speculation Attempt (Price > Max Ceiling)
    if (isPrivate && price > maxCeiling) {
      const excess = (((price - maxCeiling) / maxCeiling) * 100).toFixed(1);
      const alertId = `ALT-${Date.now().toString().slice(-6)}`;

      const newViolation: PriceViolationAlert = {
        id: alertId,
        farmerId: 'usr-farmer-' + crop.id,
        farmerName: crop.farmerName,
        buyerId: 'usr-buyer-' + Math.floor(Math.random() * 1000),
        buyerName,
        cropId: 1,
        cropName: crop.title,
        wilaya: wilayaName || crop.wilaya,
        attemptedPrice: price,
        maxLegalPrice: maxCeiling,
        minFloorPrice: minFloor,
        excessPercentage: `+${excess}%`,
        status: 'unresolved',
        timestamp: 'الآن (' + timestamp + ')',
        notes: `محاولة شراء بسعر ${price} د.ج يتجاوز السقف القانوني (${maxCeiling} د.ج) بنسبة ${excess}%. تم رفض المعاملة عبر ROLLBACK.`,
      };

      setViolations(prev => [newViolation, ...prev]);

      // Sound Alarm
      playAlertChime();

      // Log ACID steps
      setAcidLogs(prev => [
        {
          id: 'log-' + Date.now(),
          step: 'BEGIN -> ANTI_SPECULATION_BREACH -> ROLLBACK',
          status: 'danger',
          sqlSnippet: `BEGIN;\nSELECT * FROM farmer_listings WHERE id = '${crop.id}' FOR UPDATE;\n-- FAILED: agreed_unit_price (${price}) > max_ceiling_price (${maxCeiling})\nINSERT INTO price_violation_alerts (attempted_price, max_legal_price, excess_percentage) VALUES (${price}, ${maxCeiling}, ${excess});\nROLLBACK;`,
          details: `محاولة مضاربة مرفوضة! نسبة التجاوز ${excess}%. تم التراجع عن الصفقة وإخطار غرفة العمليات الرقابية.`,
          timestamp,
        },
        ...prev.slice(0, 15)
      ]);

      return {
        success: false,
        message: `محاولة مضاربة مرفوضة! السعر المقترح (${price} دج) يتجاوز السقف القانوني (${maxCeiling} دج). تم تسجيل المخالفة برقم ${alertId} وإخطار غرفة العمليات الرقابية.`,
        alert: newViolation
      };
    }

    // Case 2: Farmer Floor Protection (Price < Min Floor)
    if (price < minFloor) {
      setAcidLogs(prev => [
        {
          id: 'log-' + Date.now(),
          step: 'BEGIN -> FLOOR_PRICE_BREACH -> ROLLBACK',
          status: 'warning',
          sqlSnippet: `BEGIN;\nSELECT * FROM farmer_listings WHERE id = '${crop.id}' FOR UPDATE;\n-- FAILED: agreed_unit_price (${price}) < min_floor_price (${minFloor})\nROLLBACK;`,
          details: `تم رفض الصفقة لحماية حقوق الفلاح! السعر أقل من الحد الأدنى المضمون (${minFloor} دج).`,
          timestamp,
        },
        ...prev.slice(0, 15)
      ]);

      return {
        success: false,
        message: `السعر المقترح (${price} دج) أقل من السعر الأدنى المضمون لحماية الفلاح (${minFloor} دج).`
      };
    }

    // Case 3: Compliant Transaction (COMMIT)
    const totalAmount = price * quantity * 1000;
    const waybillNumber = `DZ-WAYBILL-${Date.now().toString().slice(-6)}`;

    setAcidLogs(prev => [
      {
        id: 'log-' + Date.now(),
        step: 'BEGIN -> VERIFY_CEILING -> INSERT_TX -> COMMIT',
        status: 'success',
        sqlSnippet: `BEGIN;\nSELECT * FROM farmer_listings WHERE id = '${crop.id}' FOR UPDATE;\nINSERT INTO transactions (purchased_quantity, agreed_unit_price, total_amount, waybill_number) VALUES (${quantity}, ${price}, ${totalAmount}, '${waybillNumber}');\nUPDATE farmer_listings SET quantity_available = quantity_available - ${quantity} WHERE id = '${crop.id}';\nCOMMIT;`,
        details: `تمت المعاملة بنجاح ضمن الأسعار المقننة وتوليد سند الشحن ${waybillNumber}.`,
        timestamp,
      },
      ...prev.slice(0, 15)
    ]);

    return {
      success: true,
      message: `تم اعتماد الصفقة بنجاح مطابقة للأسقف القانونية وتوليد سند الشحن ${waybillNumber}.`
    };
  };

  const submitWholesalerOffer = (
    cropId: string, 
    offerData: {
      wholesalerName: string;
      companyName: string;
      taxNumber: string;
      wilaya: string;
      offeredPricePerKg: number;
      requestedQuantityTons: number;
      phone: string;
      deliveryDate: string;
    }
  ): boolean => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return false;

    // Run through ACID engine check
    const acidResult = executeACIDSimulation(
      cropId,
      offerData.companyName + ' (' + offerData.wholesalerName + ')',
      offerData.requestedQuantityTons,
      offerData.offeredPricePerKg,
      true,
      offerData.wilaya
    );

    if (!acidResult.success) {
      addToast({
        type: 'error',
        title: 'رفض المعاملة (ACID ROLLBACK)!',
        message: acidResult.message,
      });
      return false;
    }

    const newOffer: WholesalerOffer = {
      ...offerData,
      id: 'off-' + Date.now(),
      status: 'pending',
      date: 'الآن',
    };

    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return {
          ...c,
          status: 'in_bidding',
          wholesalerOffers: [newOffer, ...c.wholesalerOffers],
        };
      }
      return c;
    }));

    addToast({
      type: 'success',
      title: 'تم إرسال طلب الشراء إلى الفلاح',
      message: `تم تقديم عرضكم بقيمة ${offerData.offeredPricePerKg} د.ج/كغ لكمية ${offerData.requestedQuantityTons} طن ضمن السقف المسموح به.`,
    });
    return true;
  };

  const acceptWholesalerOffer = (cropId: string, offerId: string) => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return;
    const offer = crop.wholesalerOffers.find(o => o.id === offerId);
    if (!offer) return;

    const totalAmountDZD = offer.offeredPricePerKg * offer.requestedQuantityTons * 1000;
    const certNum = 'CERT-PRIV-DZ-' + Math.floor(100000 + Math.random() * 900000);

    const newContract: OfficialContract = {
      id: 'cont-' + Date.now(),
      listingId: crop.id,
      cropTitle: crop.title,
      buyerType: 'wholesaler',
      buyerName: offer.wholesalerName,
      buyerEntity: offer.companyName,
      sellerFarmerName: crop.farmerName,
      sellerCardId: crop.nationalFarmerCardId,
      wilayaSource: crop.wilaya,
      destination: offer.wilaya,
      quantityTons: offer.requestedQuantityTons,
      pricePerKg: offer.offeredPricePerKg,
      totalAmountDZD,
      contractDate: new Date().toISOString().split('T')[0],
      contractNumber: certNum,
      qrCodeToken: `WHOLESALE-CONTRACT-${certNum}`,
      legalStatus: 'معتمد رسمياً',
    };

    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return {
          ...c,
          status: 'purchased_by_wholesaler',
          wholesalerOffers: c.wholesalerOffers.map(o => o.id === offerId ? { ...o, status: 'accepted' } : { ...o, status: 'rejected' }),
        };
      }
      return c;
    }));

    setContracts(prev => [newContract, ...prev]);

    addToast({
      type: 'success',
      title: 'تم قبول عرض تاجر الجملة وتوقيع العقد الرقمي',
      message: `تم تحرير عقد التوريد القانوني رقم ${certNum} مع ${offer.companyName}، وأصبح سند الشحن ساري المفعول للتنقل القانوني.`,
    });

    setSelectedContractForModal(newContract);
  };

  const updatePriceCeiling = (
    ceilingId: string, 
    newMaxLegalPrice: number, 
    newFloorPrice: number, 
    decreeRef: string,
    subsidyPerKg: number
  ) => {
    setPriceCeilings(prev => prev.map(rule => {
      if (rule.id === ceilingId) {
        return {
          ...rule,
          maxLegalPricePerKg: newMaxLegalPrice,
          recommendedFloorPricePerKg: newFloorPrice,
          legalDecreeRef: decreeRef,
          supportSubsidyPerKg: subsidyPerKg,
          lastUpdated: 'تم التحديث للتو',
        };
      }
      return rule;
    }));

    // Update matching crops in listings
    const targetRule = priceCeilings.find(r => r.id === ceilingId);
    if (targetRule) {
      setCrops(prev => prev.map(c => {
        if (c.variety.includes(targetRule.cropName) || c.title.includes(targetRule.cropName) || c.category === targetRule.category) {
          return {
            ...c,
            statutoryCeilingPricePerKg: newMaxLegalPrice,
          };
        }
        return c;
      }));
    }

    addToast({
      type: 'warning',
      title: 'تم تحديث وتعميم السقف السعري السيادي!',
      message: `تم تفعيل سقف سعري إلزامي جديد (${newMaxLegalPrice} د.ج) بموجب ${decreeRef}. المنظومة تسري فورياً على كافة الفلاحين والوسطاء.`,
    });
  };

  const reportSpeculation = (data: {
    cropName: string;
    wilaya: string;
    priceSpotted: number;
    notes: string;
    wholesalerStoreName?: string;
  }) => {
    const newAlert: MarketAlert = {
      id: 'alt-' + Date.now(),
      cropName: data.cropName,
      wilaya: data.wilaya,
      type: 'speculation_risk',
      severity: 'critical',
      title: `تبليغ فوري: رصد تجاوز سعري (${data.priceSpotted} د.ج)`,
      message: `${data.notes} | الجهة المشتبه بها: ${data.wholesalerStoreName || 'وسيط غير معتمد'} بموقع ${data.wilaya}. تم إحالة البلاغ لخلية التفتيش وقمع الغش التابعة لوزارة التجارة والفلاحة.`,
      timestamp: 'الآن',
      resolved: false,
    };

    setAlerts(prev => [newAlert, ...prev]);

    addToast({
      type: 'info',
      title: 'تم استقبال البلاغ وإحالته للمرصد الوطني',
      message: 'شكراً لمساهمتك في حماية القدرة الشرائية. تم إرسال إشعار فوري لفرق المراقبة والردع الميداني.',
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    addToast({
      type: 'success',
      title: 'تم تسوية وتفريغ الإنذار',
      message: 'تم اتخاذ الإجراءات الميدانية (ضخ كميات تبريد أو تدخل المصالح الرقابية).',
    });
  };

  const resetData = () => {
    setCrops(INITIAL_CROPS);
    setPriceCeilings(INITIAL_PRICE_CEILINGS);
    setContracts(INITIAL_CONTRACTS);
    setAlerts(INITIAL_ALERTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CROPS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CEILINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CONTRACTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ALERTS);
    addToast({
      type: 'info',
      title: 'تمت استعادة البيانات الافتراضية',
      message: 'تم تصفير المنصة بنجاح وتحميل المحاصيل والمراسيم المعتمدة.',
    });
  };

  return (
    <MarketContext.Provider
      value={{
        role,
        setRole,
        crops,
        priceCeilings,
        wilayaBalances,
        alerts,
        contracts,
        violations,
        acidLogs,
        isAuthorityRoomConnected,
        isSoundAlertEnabled,
        toggleSoundAlert,
        toasts,
        addToast,
        removeToast,
        addCropListing,
        executeSovereignPurchase,
        submitWholesalerOffer,
        acceptWholesalerOffer,
        updatePriceCeiling,
        reportSpeculation,
        resolveAlert,
        freezeUserAccount,
        investigateAlert,
        penalizeAlert,
        executeACIDSimulation,
        resetData,
        selectedContractForModal,
        setSelectedContractForModal,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
