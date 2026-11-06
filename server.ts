/**
 * سوق المحصول (Souq El Mahsool)
 * خادم الواجهة الخلفية السيادي (Express.js + PostgreSQL + Socket.io)
 * مع محرك التحقق الصارم من السقف السعري وقمع المضاربة
 */

import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

// إعداد خادم WebSockets مع دعم CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// الاتصال بقاعدة بيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/souq_el_mahsool',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// إدارة اتصالات WebSockets لغرفة العمليات الرقابية
io.on('connection', (socket: Socket) => {
  console.log(`🔌 [Socket.io] متصل جديد: ${socket.id}`);

  // انضمام مسؤولي الدولة ومفتشي قمع الغش للغرفة السيادية
  socket.on('join_authority_room', (data: { official_name: string; badge_number?: string }) => {
    socket.join('authorities_room');
    console.log(`🛡️ [غرفة العمليات] انضمام المسؤول: ${data.official_name} (${data.badge_number || 'مفتش معتمد'})`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ [Socket.io] انقطع اتصال: ${socket.id}`);
  });
});

/**
 * دالة بث التنبيه الفوري لغرفة العمليات الرقابية
 */
function broadcastSpeculationAlert(payload: {
  id: string;
  buyer_id: string;
  buyer_name: string;
  crop_name: string;
  wilaya: string;
  attempted_price: number;
  max_ceiling_price: number;
  excess_percentage: string;
  timestamp: string;
}) {
  io.to('authorities_room').emit('speculation_alert', payload);
  console.warn(`🚨 [تنبيه رقابي مبثوث]: محاولة مضاربة على ${payload.crop_name} بـ ${payload.attempted_price} دج (+${payload.excess_percentage})`);
}

/**
 * نقطة نهاية (Endpoint): معالجة صفقة شراء مع التحقق الصارم من السقف السعري (ACID)
 */
app.post('/api/transactions', async (req: Request, res: Response): Promise<any> => {
  const {
    listing_id,
    buyer_id,
    buyer_name,
    purchased_quantity,
    agreed_unit_price,
    transaction_type, // 'private_purchase' أو 'state_sovereign_acquisition'
    cooperative_id,
    wilaya
  } = req.body;

  const client = await pool.connect();

  try {
    // 1. بدء المعاملة البرمجية (ACID Transaction)
    await client.query('BEGIN');

    // 2. التحقق من وجود العرض وحالته وتوفر الكمية
    const listingQuery = `
      SELECT fl.*, c.name_ar as crop_name, w.name_ar as wilaya_name
      FROM farmer_listings fl
      JOIN crops c ON fl.crop_id = c.id
      LEFT JOIN wilayas w ON fl.wilaya_id = w.id
      WHERE fl.id = $1 AND fl.status = 'available'
      FOR UPDATE;
    `;
    const listingResult = await client.query(listingQuery, [listing_id]);

    if (listingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'عروض المحصول غير متاحة أو تم شراؤها مسبقاً.' });
    }

    const listing = listingResult.rows[0];

    if (purchased_quantity > Number(listing.quantity_available)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'الكمية المطلوبة تتجاوز الكمية المتاحة لدى الفلاح.' });
    }

    // 3. جلب السقف السعري النشط (الأعلى والأدنى) لهذا المحصول
    const ceilingQuery = `
      SELECT max_ceiling_price, min_floor_price 
      FROM price_ceilings 
      WHERE crop_id = $1 
        AND effective_date <= CURRENT_DATE 
        AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
      ORDER BY effective_date DESC 
      LIMIT 1;
    `;
    const ceilingResult = await client.query(ceilingQuery, [listing.crop_id]);

    if (ceilingResult.rows.length > 0) {
      const { max_ceiling_price, min_floor_price } = ceilingResult.rows[0];
      const maxCeilingNum = Number(max_ceiling_price);
      const minFloorNum = Number(min_floor_price);
      const agreedPriceNum = Number(agreed_unit_price);

      // أ) التحقق من السقف القانوني (لتجار الجملة الخواص)
      if (transaction_type === 'private_purchase' && agreedPriceNum > maxCeilingNum) {
        const excessPercentage = (((agreedPriceNum - maxCeilingNum) / maxCeilingNum) * 100).toFixed(1);
        const alertCode = `ALT-${Date.now()}`;

        // تسجيل المخالفة في جدول price_violation_alerts
        await client.query(`
          INSERT INTO price_violation_alerts (
            alert_code, farmer_id, buyer_id, crop_id, wilaya_id,
            attempted_price, max_legal_price, excess_percentage, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'unresolved');
        `, [
          alertCode,
          listing.farmer_id,
          buyer_id,
          listing.crop_id,
          listing.wilaya_id,
          agreedPriceNum,
          maxCeilingNum,
          excessPercentage
        ]);

        await client.query('COMMIT'); // حفظ سجل التنبيه

        // إطلاق البث اللحظي للغرفة الرقابية عبر Socket.io
        broadcastSpeculationAlert({
          id: alertCode,
          buyer_id,
          buyer_name: buyer_name || 'تاجر جملة خاص',
          crop_name: listing.crop_name,
          wilaya: wilaya || listing.wilaya_name || 'غير محددة',
          attempted_price: agreedPriceNum,
          max_ceiling_price: maxCeilingNum,
          excess_percentage: `${excessPercentage}%`,
          timestamp: new Date().toLocaleTimeString('ar-DZ')
        });

        return res.status(400).json({
          success: false,
          error: `محاولة مضاربة مرفوضة! السعر المقترح (${agreedPriceNum} دج) يتجاوز السقف القانوني (${maxCeilingNum} دج). تم تسجيل المخالفة وإبلاغ المصالح الرقابية فورياً.`
        });
      }

      // ب) حماية الفلاح من بخس السعر
      if (agreedPriceNum < minFloorNum) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: `السعر المقترح (${agreedPriceNum} دج) أقل من الحد الأدنى المضمون لحماية الفلاح (${minFloorNum} دج).`
        });
      }
    }

    // 4. حساب المبلغ الإجمالي وإنشاء رقم سند الشحن الرسمي
    const totalAmount = Number(purchased_quantity) * Number(agreed_unit_price);
    const waybillNum = `DZ-WAYBILL-${Date.now().toString().slice(-6)}`;

    // 5. تسجيل المعاملة في جدول transactions
    const insertTransactionQuery = `
      INSERT INTO transactions (
        listing_id, buyer_id, cooperative_id, purchased_quantity, 
        agreed_unit_price, total_amount, transaction_type, status, 
        anti_speculation_checked, waybill_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', TRUE, $8)
      RETURNING *;
    `;
    const transactionResult = await client.query(insertTransactionQuery, [
      listing_id,
      buyer_id,
      transaction_type === 'state_sovereign_acquisition' ? cooperative_id : null,
      purchased_quantity,
      agreed_unit_price,
      totalAmount,
      transaction_type,
      waybillNum
    ]);

    // 6. تحديث الكمية المتاحة في عرض الفلاح
    const remainingQuantity = Number(listing.quantity_available) - Number(purchased_quantity);
    const newStatus = remainingQuantity <= 0 ? 'sold' : 'available';

    await client.query(
      `UPDATE farmer_listings SET quantity_available = $1, status = $2 WHERE id = $3`,
      [remainingQuantity, newStatus, listing_id]
    );

    // اعتماد المعاملة نهائياً
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'تم إتمام الصفقة بنجاح وتوليد سند الشحن ورخصة النقل الرسمية.',
      transaction: transactionResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database Error:', err);
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم أثناء معالجة الصفقة.' });
  } finally {
    client.release();
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🇩🇿 [سوق المحصول] الخادم السيادي يعمل على المنفذ ${PORT}`);
  });
}

export { app, server, io, pool };
