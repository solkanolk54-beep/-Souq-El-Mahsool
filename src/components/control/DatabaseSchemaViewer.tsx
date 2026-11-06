import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Link, 
  Copy, 
  Check, 
  Code, 
  Layers, 
  ShieldCheck, 
  Zap,
  Server
} from 'lucide-react';

interface TableDefinition {
  name: string;
  nameAr: string;
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    description: string;
  }[];
  indexes: string[];
}

const DATABASE_TABLES: TableDefinition[] = [
  {
    name: 'wilayas',
    nameAr: 'جدول الولايات (58 ولاية)',
    description: 'المرجع الجغرافي الوطني لربط الإنتاج وسلاسل التبريد والتوزيع الإقليمي.',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'المعرّف التسلسلي للولاية' },
      { name: 'code', type: 'VARCHAR(3) UNIQUE', description: 'الرمز الرقمي الرسمي (مثال: 16، 39)' },
      { name: 'name_ar', type: 'VARCHAR(100)', description: 'اسم الولاية باللغة العربية' },
      { name: 'name_fr', type: 'VARCHAR(100)', description: 'اسم الولاية بالفرنسية' },
    ],
    indexes: ['PRIMARY KEY (id)', 'UNIQUE (code)'],
  },
  {
    name: 'users',
    nameAr: 'جدول المستخدمين والأدوار (Multi-Role RBAC)',
    description: 'إدارة حسابات الفلاحين، تجار الجملة، وممثلي التعاونيات والدولة.',
    columns: [
      { name: 'id', type: 'UUID DEFAULT uuid_generate_v4()', isPrimary: true, description: 'المعرّف الفريد العالمي' },
      { name: 'full_name', type: 'VARCHAR(150)', description: 'الاسم الكامل أو التسمية التجارية' },
      { name: 'phone', type: 'VARCHAR(20) UNIQUE', description: 'رقم الهاتف للاتصال والتحقق' },
      { name: 'password_hash', type: 'VARCHAR(255)', description: 'كلمة المرور المشفرة bcrypt' },
      { name: 'role', type: 'user_role (ENUM)', description: 'الدور (farmer, private_wholesaler, state_agent, admin)' },
      { name: 'wilaya_id', type: 'INT', isForeign: true, references: 'wilayas(id)', description: 'ولاية الإقامة أو النشاط' },
      { name: 'is_verified', type: 'BOOLEAN DEFAULT FALSE', description: 'توثيق بطاقة الفلاح أو السجل التجاري' },
      { name: 'is_frozen', type: 'BOOLEAN DEFAULT FALSE', description: 'تجميد الحساب عند ارتكاب مخالفة مضاربة' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'تاريخ إنشاء الحساب' },
    ],
    indexes: ['PRIMARY KEY (id)', 'idx_users_role (role)', 'idx_users_phone (phone)'],
  },
  {
    name: 'crops',
    nameAr: 'جدول المحاصيل والمنتجات الأساسية',
    description: 'قائمة المواد الفلاحية الاستراتيجية الخاضعة لضبط الأسعار.',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'معرّف المحصول' },
      { name: 'name_ar', type: 'VARCHAR(100)', description: 'اسم المحصول بالعربية (بطاطا، قمح، طماطم...)' },
      { name: 'name_fr', type: 'VARCHAR(100)', description: 'اسم المحصول بالفرنسية' },
      { name: 'category', type: 'VARCHAR(50)', description: 'الشعبة الفلاحية (خضروات، حبوب، فواكه، تمور)' },
      { name: 'unit_type', type: 'VARCHAR(20) DEFAULT "kg"', description: 'وحدة القياس (كغ، طن، قنطار)' },
      { name: 'is_strategic', type: 'BOOLEAN DEFAULT TRUE', description: 'مادة واسعة الاستهلاك مشمولة بالسقف الإلزامي' },
    ],
    indexes: ['PRIMARY KEY (id)'],
  },
  {
    name: 'price_ceilings',
    nameAr: 'جدول الأسعار المسقفة الرسمية (النافذة السيادية)',
    description: 'يحدد السقف الأعلى لحماية المستهلك والسعر الأدنى المضمون للفلاح.',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'معرّف السقف' },
      { name: 'crop_id', type: 'INT', isForeign: true, references: 'crops(id)', description: 'المحصول المقنن' },
      { name: 'max_ceiling_price', type: 'DECIMAL(10, 2)', description: 'السقف السعري الأقصى المسموح به قانوناً' },
      { name: 'min_floor_price', type: 'DECIMAL(10, 2)', description: 'السعر المرجعي الأدنى لحماية الفلاح' },
      { name: 'support_subsidy', type: 'DECIMAL(10, 2)', description: 'قيمة الدعم التكميلي للدولة للكيلوغرام' },
      { name: 'effective_date', type: 'DATE', description: 'تاريخ سريان المرسوم' },
      { name: 'expiry_date', type: 'DATE', description: 'تاريخ انتهاء السريان (إن وجد)' },
      { name: 'legal_decree_ref', type: 'VARCHAR(255)', description: 'رقم وتاريخ المرسوم التنفيذي الوزاري' },
      { name: 'set_by_user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'المسؤول السيادي المصدر للقرار' },
    ],
    indexes: ['PRIMARY KEY (id)', 'idx_ceilings_crop (crop_id)', 'idx_ceilings_dates (effective_date, expiry_date)'],
  },
  {
    name: 'farmer_listings',
    nameAr: 'جدول عروض الفلاحين (Farmer Listings)',
    description: 'المحاصيل المعروضة من طرف الفلاحين مع الكميات والتكاليف.',
    columns: [
      { name: 'id', type: 'UUID DEFAULT uuid_generate_v4()', isPrimary: true, description: 'معرّف العرض' },
      { name: 'farmer_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'الفلاح صاحب المحصول' },
      { name: 'crop_id', type: 'INT', isForeign: true, references: 'crops(id)', description: 'نوع المحصول' },
      { name: 'quantity_available', type: 'DECIMAL(12, 2)', description: 'الكمية المتاحة بالطن' },
      { name: 'production_cost', type: 'DECIMAL(10, 2)', description: 'التكلفة الفعلية للكيلوغرام' },
      { name: 'proposed_price', type: 'DECIMAL(10, 2)', description: 'سعر البيع المقترح تسليم المزرعة' },
      { name: 'wilaya_id', type: 'INT', isForeign: true, references: 'wilayas(id)', description: 'ولاية الحقل والإنتاج' },
      { name: 'status', type: 'VARCHAR(30) DEFAULT "available"', description: 'الحالة (available, sold, state_acquired)' },
      { name: 'harvest_date', type: 'DATE', description: 'تاريخ الجني والحصاد' },
    ],
    indexes: ['PRIMARY KEY (id)', 'idx_listings_crop (crop_id)', 'idx_listings_wilaya (wilaya_id)', 'idx_listings_status (status)'],
  },
  {
    name: 'cooperatives',
    nameAr: 'جدول التعاونيات العمومية / تاجر الدولة',
    description: 'المؤسسات والدواوين المكلفة بالتدخل المباشر والشراء السيادي.',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'معرّف التعاونية' },
      { name: 'name', type: 'VARCHAR(150)', description: 'اسم الديوان (SARPA, ONILEV, OAIC - CCLS)' },
      { name: 'wilaya_id', type: 'INT', isForeign: true, references: 'wilayas(id)', description: 'المقر الولائي' },
      { name: 'manager_user_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'المندوب الولائي المسؤول' },
      { name: 'storage_capacity_tons', type: 'DECIMAL(12, 2)', description: 'طاقة استيعاب غرف التبريد والصوامع' },
      { name: 'silo_location', type: 'TEXT', description: 'موقع المستودعات الاستراتيجية' },
    ],
    indexes: ['PRIMARY KEY (id)'],
  },
  {
    name: 'transactions',
    nameAr: 'جدول المعاملات وعقود الشراء وسندات الشحن',
    description: 'تسجيل الصفقات بعد التحقق الصارم من عدم تجاوز السقف السعري.',
    columns: [
      { name: 'id', type: 'UUID DEFAULT uuid_generate_v4()', isPrimary: true, description: 'معرّف الصفقة' },
      { name: 'listing_id', type: 'UUID', isForeign: true, references: 'farmer_listings(id)', description: 'العرض المعني' },
      { name: 'buyer_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'الجهة المشترية (خاص أو ممثل الدولة)' },
      { name: 'cooperative_id', type: 'INT', isForeign: true, references: 'cooperatives(id)', description: 'يُملأ في حال الشراء السيادي' },
      { name: 'purchased_quantity', type: 'DECIMAL(12, 2)', description: 'الكمية المشتراة بالطن' },
      { name: 'agreed_unit_price', type: 'DECIMAL(10, 2)', description: 'السعر النهائي المتفق عليه (خاضع للسقف)' },
      { name: 'total_amount', type: 'DECIMAL(12, 2)', description: 'المبلغ الإجمالي بالدينار الجزائري' },
      { name: 'transaction_type', type: 'transaction_type (ENUM)', description: 'private_purchase أو state_sovereign_acquisition' },
      { name: 'waybill_number', type: 'VARCHAR(100)', description: 'رقم سند الشحن ورخصة النقل الرسمية' },
      { name: 'anti_speculation_checked', type: 'BOOLEAN DEFAULT TRUE', description: 'تأكيد تجاوز الفحص الآلي للأسقف' },
    ],
    indexes: ['PRIMARY KEY (id)', 'idx_transactions_date (created_at)', 'idx_transactions_buyer (buyer_id)'],
  },
  {
    name: 'price_violation_alerts',
    nameAr: 'جدول تسجيل محاولات المضاربة والمخالفات',
    description: 'يسجل كل محاولة لتقديم سعر يفوق السقف القانوني لتوثيقها قضائياً وبثها للغرفة.',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'معرّف الإنذار' },
      { name: 'alert_code', type: 'VARCHAR(50) UNIQUE', description: 'كود التنبيه (مثال: ALT-109281)' },
      { name: 'farmer_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'الفلاح المورّد' },
      { name: 'buyer_id', type: 'UUID', isForeign: true, references: 'users(id)', description: 'التاجر المخالف' },
      { name: 'crop_id', type: 'INT', isForeign: true, references: 'crops(id)', description: 'المحصول المستهدف بالمضاربة' },
      { name: 'attempted_price', type: 'DECIMAL(10, 2)', description: 'السعر المرتفع الذي حاول التاجر فرضه' },
      { name: 'max_legal_price', type: 'DECIMAL(10, 2)', description: 'السقف القانوني الذي تم خرقه' },
      { name: 'excess_percentage', type: 'DECIMAL(5, 2)', description: 'نسبة التجاوز المئوية' },
      { name: 'status', type: 'VARCHAR(30) DEFAULT "unresolved"', description: 'unresolved, investigated, penalized, account_frozen' },
      { name: 'action_taken', type: 'VARCHAR(100)', description: 'الإجراء الميداني المتخذ (تجميد الحساب / مصادرة)' },
    ],
    indexes: ['PRIMARY KEY (id)', 'idx_violations_status (status)', 'idx_violations_date (created_at)'],
  },
];

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<TableDefinition>(DATABASE_TABLES[3]); // Default price_ceilings
  const [activeCodeTab, setActiveCodeTab] = useState<'erd' | 'sql' | 'backend'>('erd');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlDDLCode = `-- مخطط قاعدة بيانات سوق المحصول السيادي
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- الجداول الرئيسية: wilayas, users, crops, price_ceilings, farmer_listings, cooperatives, transactions, price_violation_alerts
-- تريغر آلي (Trigger) لمنع إدراج أي معاملة تتجاوز السقف السعري
CREATE OR REPLACE FUNCTION check_anti_speculation_guard()
RETURNS TRIGGER AS $$
DECLARE
    v_max_ceiling DECIMAL(10, 2);
    v_min_floor DECIMAL(10, 2);
BEGIN
    SELECT max_ceiling_price, min_floor_price 
    INTO v_max_ceiling, v_min_floor
    FROM price_ceilings 
    WHERE crop_id = (SELECT crop_id FROM farmer_listings WHERE id = NEW.listing_id)
      AND effective_date <= CURRENT_DATE 
      AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
    ORDER BY effective_date DESC LIMIT 1;

    IF v_max_ceiling IS NOT NULL AND NEW.transaction_type = 'private_purchase' THEN
        IF NEW.agreed_unit_price > v_max_ceiling THEN
            RAISE EXCEPTION 'محاولة مضاربة مرفوضة! السعر المقترح يتجاوز السقف القانوني المسموح به.';
        END IF;
    END IF;

    IF v_min_floor IS NOT NULL AND NEW.agreed_unit_price < v_min_floor THEN
        RAISE EXCEPTION 'السعر المقترح أقل من الحد الأدنى المضمون لحماية الفلاح.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verify_speculation
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION check_anti_speculation_guard();`;

  const backendCode = `// خادم Express.js مع محرك ACID المعاملات وبث WebSockets اللحظي
app.post('/api/transactions', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // التحقق من السقف القانوني والسعر الأدنى
    if (agreed_unit_price > max_ceiling_price) {
      // تسجيل المخالفة فوراً
      await client.query('INSERT INTO price_violation_alerts ...');
      await client.query('COMMIT');
      // بث التنبيه لغرفة العمليات عبر Socket.io
      io.to('authorities_room').emit('speculation_alert', alertData);
      return res.status(400).json({ error: 'محاولة مضاربة مرفوضة!' });
    }
    // إتمام الصفقة وتوليد سند الشحن
    await client.query('INSERT INTO transactions ...');
    await client.query('UPDATE farmer_listings ...');
    await client.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});`;

  return (
    <div className="space-y-6">
      {/* Header and Mode Selector */}
      <div className="glass-card p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>مستعرض المخطط الهيكلي لقاعدة البيانات السيادية (PostgreSQL ERD Schema)</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            8 جداول مركزية متكاملة تدعم نظام الأدوار (RBAC)، التريغرز الوقائية، وفهارس الاستعلام الجغرافي السريع.
          </p>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveCodeTab('erd')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'erd' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>مخطط الجداول (ERD)</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'sql' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>كود PostgreSQL DDL</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('backend')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'backend' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>كود Express.js Backend</span>
          </button>
        </div>
      </div>

      {activeCodeTab === 'erd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List (4 cols) */}
          <div className="lg:col-span-4 glass-card p-4 rounded-2xl border border-emerald-500/20 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 mb-2 px-1">جداول قاعدة البيانات (8 جداول):</h4>
            {DATABASE_TABLES.map((t) => {
              const isSelected = selectedTable.name === t.name;

              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t)}
                  className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400/60 text-white font-bold gold-glow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Table className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className="font-mono">{t.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{t.nameAr}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {t.columns.length} أعمدة
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Columns & Indexes Viewer (8 cols) */}
          <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-mono font-black text-white">{selectedTable.name}</h3>
                  <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    {selectedTable.nameAr}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedTable.description}</p>
              </div>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-300 border-b border-emerald-500/20">
                  <tr>
                    <th className="py-2.5 px-3">العمود</th>
                    <th className="py-2.5 px-3">النوع البرمجي (Data Type)</th>
                    <th className="py-2.5 px-3">المفاتيح والقيود</th>
                    <th className="py-2.5 px-3">الوصف الوظيفي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        {col.isPrimary && <Key className="w-3.5 h-3.5 text-amber-400" />}
                        {col.isForeign && <Link className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-300">{col.type}</td>
                      <td className="py-2.5 px-3 text-[11px]">
                        {col.isPrimary && <span className="text-amber-400 font-bold">PRIMARY KEY</span>}
                        {col.isForeign && (
                          <span className="text-cyan-400 font-semibold">
                            FK → {col.references}
                          </span>
                        )}
                        {!col.isPrimary && !col.isForeign && <span className="text-slate-500">-</span>}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px]">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes */}
            <div className="pt-3 border-t border-emerald-500/15">
              <h5 className="text-xs font-bold text-slate-400 mb-2">فهارس الأداء (Indexes & Constraints):</h5>
              <div className="flex flex-wrap gap-2">
                {selectedTable.indexes.map((idx, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400"
                  >
                    {idx}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Tab */}
      {activeCodeTab === 'sql' && (
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <span className="text-xs font-mono text-emerald-400 font-bold">db/schema.sql (PostgreSQL DDL)</span>
            <button
              onClick={() => handleCopyCode(sqlDDLCode)}
              className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[500px]">
            {sqlDDLCode}
          </pre>
        </div>
      )}

      {/* Backend Code Tab */}
      {activeCodeTab === 'backend' && (
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <span className="text-xs font-mono text-amber-400 font-bold">server.ts (Node.js + Express + Socket.io + PostgreSQL)</span>
            <button
              onClick={() => handleCopyCode(backendCode)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ كود الخادم'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl text-amber-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[500px]">
            {backendCode}
          </pre>
        </div>
      )}
    </div>
  );
};
