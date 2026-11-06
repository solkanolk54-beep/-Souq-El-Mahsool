-- ============================================================================
-- سوق المحصول (Souq El Mahsool) - المخطط الهيكلي لقاعدة البيانات السيادية
-- المنظومة الوطنية لضبط وتسقيف الأسعار الزراعية ومحاربة المضاربة في الجزائر
-- نظام إدارة قواعد البيانات: PostgreSQL 14+ / 15+ / 16+
-- ============================================================================

-- تفعيل ملحق توليد المعرفات الفريدة UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. جدول الولايات (الجمهورية الجزائرية الديمقراطية الشعبية - 58 ولاية)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wilayas (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL, -- مثال: "16", "39", "27"
    name_ar VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. جدول المستخدمين والأدوار (Multi-Role Users RBAC)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'private_wholesaler', 'state_agent', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    wilaya_id INT REFERENCES wilayas(id),
    address TEXT,
    national_card_id VARCHAR(50), -- رقم بطاقة الفلاح أو السجل التجاري
    is_verified BOOLEAN DEFAULT FALSE,
    is_frozen BOOLEAN DEFAULT FALSE, -- تجميد الحساب فور رصد مضاربة غير مشروعة
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. جدول المحاصيل والمنتجات الأساسية الخاضعة للضبط
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- (خضروات، حبوب، فواكه، تمور، حمضيات)
    unit_type VARCHAR(20) DEFAULT 'kg', -- (kg, ton, quintal)
    is_strategic BOOLEAN DEFAULT TRUE,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 4. جدول الأسعار المسقفة الرسمية (Price Ceilings - السيادي)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_ceilings (
    id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    max_ceiling_price DECIMAL(10, 2) NOT NULL, -- السقف الأقصى المسموح به قانوناً
    min_floor_price DECIMAL(10, 2) NOT NULL,   -- السعر المرجعي الأدنى لحماية الفلاح
    support_subsidy DECIMAL(10, 2) DEFAULT 0.00, -- دعم الدولة التكميلي للكيلوغرام
    effective_date DATE NOT NULL,
    expiry_date DATE,
    legal_decree_ref VARCHAR(255), -- رقم المرسوم التنفيذي الصادر عن وزارة الفلاحة
    set_by_user_id UUID REFERENCES users(id),  -- المسؤول الحكومي الذي أصدر السقف
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. جدول مزارع وعروض الفلاحين (Farmer Listings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmer_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
    quantity_available DECIMAL(12, 2) NOT NULL, -- بالطن
    min_order_tons DECIMAL(10, 2) DEFAULT 1.00,
    production_cost DECIMAL(10, 2) NOT NULL,    -- التكلفة الفعلية للكيلوغرام
    proposed_price DECIMAL(10, 2) NOT NULL,     -- السعر المقترح للبيع
    wilaya_id INT REFERENCES wilayas(id),
    status VARCHAR(30) DEFAULT 'available',     -- (available, reserved, sold, state_acquired)
    quality_grade VARCHAR(50) DEFAULT 'الدرجة الأولى الممتازة (Extra)',
    packaging_type VARCHAR(50) DEFAULT 'أكياس خيش معتمدة',
    harvest_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. جدول التعاونيات العمومية / تاجر الدولة (State Cooperatives)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cooperatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL, -- مثال: SARPA, ONILEV, OAIC - CCLS
    wilaya_id INT REFERENCES wilayas(id),
    manager_user_id UUID REFERENCES users(id),
    storage_capacity_tons DECIMAL(12, 2) NOT NULL,
    current_stored_tons DECIMAL(12, 2) DEFAULT 0.00,
    silo_location TEXT
);

-- ----------------------------------------------------------------------------
-- 7. جدول المعاملات وعقود الشراء المباشر (Transactions & State Interventions)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('private_purchase', 'state_sovereign_acquisition');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES farmer_listings(id),
    buyer_id UUID REFERENCES users(id),          -- تاجر خاص أو ممثل التعاونية العمومية
    cooperative_id INT REFERENCES cooperatives(id), -- يُملأ في حال كان الشراء سيادياً للدولة
    purchased_quantity DECIMAL(12, 2) NOT NULL,
    agreed_unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    transaction_type transaction_type NOT NULL,
    status VARCHAR(30) DEFAULT 'completed',      -- (pending, completed, cancelled)
    anti_speculation_checked BOOLEAN DEFAULT TRUE, -- تأكيد أن السعر لا يتجاوز السقف
    waybill_number VARCHAR(100),                -- رقم سند الشحن ورخصة النقل الرسمية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. جدول تسجيل تنبيهات ومحاولات المضاربة غير المشروعة (Price Violation Alerts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_violation_alerts (
    id SERIAL PRIMARY KEY,
    alert_code VARCHAR(50) UNIQUE NOT NULL,
    farmer_id UUID REFERENCES users(id),
    buyer_id UUID REFERENCES users(id),
    crop_id INT REFERENCES crops(id),
    wilaya_id INT REFERENCES wilayas(id),
    attempted_price DECIMAL(10, 2) NOT NULL,
    max_legal_price DECIMAL(10, 2) NOT NULL,
    excess_percentage DECIMAL(5, 2) NOT NULL,   -- نسبة تجاوز السقف المئوية
    status VARCHAR(30) DEFAULT 'unresolved',    -- ('unresolved', 'investigated', 'penalized', 'account_frozen')
    officer_notes TEXT,
    action_taken VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. فهارس الأداء العالية (Indexes for High-Performance Spatial & Price Queries)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_listings_crop ON farmer_listings(crop_id);
CREATE INDEX IF NOT EXISTS idx_listings_wilaya ON farmer_listings(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON farmer_listings(status);
CREATE INDEX IF NOT EXISTS idx_ceilings_crop ON price_ceilings(crop_id);
CREATE INDEX IF NOT EXISTS idx_ceilings_dates ON price_ceilings(effective_date, expiry_date);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_violations_status ON price_violation_alerts(status);
CREATE INDEX IF NOT EXISTS idx_violations_date ON price_violation_alerts(created_at);

-- ----------------------------------------------------------------------------
-- 10. تريغر وقائي آلي (PostgreSQL Trigger) لرفض أي معاملة تتجاوز السقف
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_anti_speculation_guard()
RETURNS TRIGGER AS $$
DECLARE
    v_max_ceiling DECIMAL(10, 2);
    v_min_floor DECIMAL(10, 2);
    v_crop_id INT;
BEGIN
    -- جلب معرّف المحصول من العرض
    SELECT crop_id INTO v_crop_id FROM farmer_listings WHERE id = NEW.listing_id;

    -- جلب السقف السعري النشط
    SELECT max_ceiling_price, min_floor_price 
    INTO v_max_ceiling, v_min_floor
    FROM price_ceilings 
    WHERE crop_id = v_crop_id 
      AND effective_date <= CURRENT_DATE 
      AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
    ORDER BY effective_date DESC 
    LIMIT 1;

    -- إذا وجد سقف محدد وكان الشراء تجارياً خاصاً
    IF v_max_ceiling IS NOT NULL AND NEW.transaction_type = 'private_purchase' THEN
        IF NEW.agreed_unit_price > v_max_ceiling THEN
            RAISE EXCEPTION 'محاولة مضاربة مرفوضة على مستوى قاعدة البيانات! السعر المقترح (%) يتجاوز السقف القانوني (%).', 
                NEW.agreed_unit_price, v_max_ceiling;
        END IF;
    END IF;

    -- حماية الفلاح من بخس الأسعار
    IF v_min_floor IS NOT NULL AND NEW.agreed_unit_price < v_min_floor THEN
        RAISE EXCEPTION 'السعر المقترح (%) أقل من الحد الأدنى المضمون لحماية الفلاح (%).', 
            NEW.agreed_unit_price, v_min_floor;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_speculation ON transactions;
CREATE TRIGGER trg_verify_speculation
BEFORE INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION check_anti_speculation_guard();
