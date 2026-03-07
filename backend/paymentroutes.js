import express from 'express';
import fetch from 'node-fetch';

const MARZPAY_API_URL = process.env.MARZPAY_API_URL || 'https://wallet.wearemarz.com/api/v1';
const MARZPAY_API_CREDENTIALS = process.env.MARZPAY_API_CREDENTIALS || '';
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_IDS = (process.env.TELEGRAM_CHAT_ID || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

// Startup diagnostic (safe: no secrets logged)
const credsSet = Boolean(MARZPAY_API_CREDENTIALS && MARZPAY_API_CREDENTIALS.length > 0);
console.log('[Payment] Config at startup:', {
  MARZPAY_API_CREDENTIALS_set: credsSet,
  MARZPAY_API_CREDENTIALS_length: MARZPAY_API_CREDENTIALS ? MARZPAY_API_CREDENTIALS.length : 0,
  MARZPAY_API_URL,
  APP_URL,
  env_has_MARZPAY_API_CREDENTIALS: 'MARZPAY_API_CREDENTIALS' in process.env,
});

function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_CHAT_IDS.length === 0) return Promise.resolve();
  return Promise.all(
    TELEGRAM_CHAT_IDS.map((chatId) =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      }).then((r) => r.json()).catch((e) => console.error('Telegram send error:', e.message))
    )
  );
}

function generateReference() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default (pool) => {
  const router = express.Router();

  // GET /api/payments/config – safe diagnostic (no secrets), for investigating config issues
  router.get('/payments/config', (_req, res) => {
    const credsSet = Boolean(MARZPAY_API_CREDENTIALS && MARZPAY_API_CREDENTIALS.length > 0);
    const payload = {
      payment_configured: credsSet,
      MARZPAY_API_CREDENTIALS_set: credsSet,
      MARZPAY_API_CREDENTIALS_length: MARZPAY_API_CREDENTIALS ? MARZPAY_API_CREDENTIALS.length : 0,
      MARZPAY_API_URL,
      APP_URL,
      webhook_url: `${APP_URL.replace(/\/$/, '')}/api/webhooks/marzpay`,
      env_has_MARZPAY_API_CREDENTIALS: 'MARZPAY_API_CREDENTIALS' in process.env,
    };
    console.log('[Payment] GET /payments/config –', JSON.stringify(payload));
    return res.json(payload);
  });

  // POST /api/payments/collect – initiate MarzPay collection (mobile money)
  router.post('/payments/collect', async (req, res) => {
    console.log('[Payment] POST /payments/collect – body:', JSON.stringify(req.body, null, 2));
    try {
      const { amount, phone_number, order_id, description } = req.body;

      if (!amount || !phone_number || !order_id) {
        console.log('[Payment] Collect rejected – missing fields');
        return res.status(400).json({
          error: 'Missing required fields: amount, phone_number, order_id',
        });
      }

      let formattedPhone = String(phone_number).trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.replace(/^0/, '');
        formattedPhone = `+256${formattedPhone}`;
      }
      if (!/^\+256[0-9]{9}$/.test(formattedPhone)) {
        return res.status(400).json({
          error: 'Invalid phone number. Use 10 digits e.g. 0712345678 or +256712345678',
        });
      }
      // First digit of local number: +256 7 54092850 -> index 4 is '7' (07x/03x)
      const prefix = formattedPhone.charAt(4);
      if (!['7', '3'].includes(prefix)) {
        return res.status(400).json({
          error: 'Invalid phone. Must be (07...) or  (03...)',
        });
      }

      const reference = generateReference();
      const callbackUrl = `${APP_URL.replace(/\/$/, '')}/api/webhooks/marzpay`;

      const marzpayRequest = {
        amount: parseInt(amount, 10),
        phone_number: formattedPhone,
        country: 'UG',
        reference,
        description: description || `Order #${order_id} payment`,
        callback_url: callbackUrl,
      };

      if (!MARZPAY_API_CREDENTIALS) {
        const diag = {
          MARZPAY_API_CREDENTIALS_length: 0,
          MARZPAY_API_CREDENTIALS_in_env: 'MARZPAY_API_CREDENTIALS' in process.env,
          MARZPAY_API_URL,
          APP_URL,
        };
        console.warn('[Payment] Collect rejected – MARZPAY_API_CREDENTIALS missing or empty. Diagnostic:', JSON.stringify(diag));
        return res.status(503).json({
          error: 'Payment service not configured (MARZPAY_API_CREDENTIALS)',
          _diagnostic: diag,
        });
      }

      console.log('[Payment] Calling MarzPay collect-money – amount:', amount, 'phone:', formattedPhone, 'order_id:', order_id, 'callback:', callbackUrl);
      const marzpayResponse = await fetch(`${MARZPAY_API_URL}/collect-money`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${MARZPAY_API_CREDENTIALS}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marzpayRequest),
      });

      const responseText = await marzpayResponse.text();
      console.log('[Payment] MarzPay response status:', marzpayResponse.status, 'body:', responseText?.slice(0, 500));
      let marzpayData;
      try {
        marzpayData = JSON.parse(responseText);
      } catch (_) {
        console.log('[Payment] MarzPay response parse error');
        return res.status(500).json({ error: 'Invalid response from payment service' });
      }

      if (!marzpayResponse.ok) {
        const msg = marzpayData.message || marzpayData.error || 'Payment initiation failed';
        return res
          .status(marzpayResponse.status === 422 ? 422 : 500)
          .json({ error: msg, details: marzpayData.errors || marzpayData.details });
      }

      if (marzpayData.status !== 'success') {
        return res
          .status(500)
          .json({ error: marzpayData.message || 'Payment initiation failed' });
      }

      const transactionData = marzpayData.data?.transaction || {};
      const collectionData = marzpayData.data?.collection || {};
      const amountData = collectionData.amount || {};
      let paymentStatus = (transactionData.status || 'pending').toLowerCase();
      if (paymentStatus === 'successful') paymentStatus = 'completed';
      else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') paymentStatus = 'failed';
      else if (paymentStatus !== 'processing') paymentStatus = 'processing';

      const provider = (collectionData.provider || 'mtn').toLowerCase().includes('airtel')
        ? 'airtel'
        : 'mtn';

      await pool.query(
        `INSERT INTO payments (order_id, amount, phone_number, reference, provider, status, transaction_uuid, provider_reference, marzpay_response, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          order_id,
          amountData.raw ?? parseInt(amount, 10),
          formattedPhone,
          transactionData.reference || reference,
          provider,
          paymentStatus,
          transactionData.uuid || null,
          transactionData.provider_reference || null,
          JSON.stringify(marzpayData),
        ]
      );

      const [rows] = await pool.query('SELECT id, reference, status FROM payments WHERE reference = ?', [
        transactionData.reference || reference,
      ]);
      const payment = rows[0];
      console.log('[Payment] Payment stored – id:', payment?.id, 'reference:', payment?.reference, 'status:', payment?.status);

      return res.json({
        success: true,
        message: marzpayData.message || 'Payment initiated',
        data: {
          payment_id: payment?.id,
          reference: payment?.reference,
          status: payment?.status || paymentStatus,
          amount: amountData.raw ?? parseInt(amount, 10),
          provider,
        },
      });
    } catch (err) {
      console.error('Payment collect error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // GET /api/payments/status/:reference – for frontend polling
  router.get('/payments/status/:reference', async (req, res) => {
    console.log('[Payment] GET /payments/status – reference:', req.params.reference);
    try {
      const [rows] = await pool.query(
        'SELECT id, order_id, reference, status, amount, phone_number, created_at FROM payments WHERE reference = ?',
        [req.params.reference]
      );
      if (!rows.length) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      const p = rows[0];
      return res.json({
        reference: p.reference,
        status: p.status,
        payment_id: p.id,
        order_id: p.order_id,
        amount: p.amount,
      });
    } catch (err) {
      console.error('Payment status error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // POST /api/webhooks/marzpay – MarzPay callback (always return 200)
  router.post('/webhooks/marzpay', async (req, res) => {
    console.log('[Payment] Webhook POST /webhooks/marzpay – body:', JSON.stringify(req.body, null, 2)?.slice(0, 800));
    const body = req.body || {};
    let transaction = body.transaction;
    let collection = body.collection;
    if (body.data?.transaction) {
      transaction = body.data.transaction;
      collection = body.data.collection;
    }

    if (!transaction?.reference) {
      return res.status(200).json({ success: false, error: 'Missing transaction.reference' });
    }

    const reference = transaction.reference;
    let paymentStatus = (transaction.status || '').toLowerCase();
    if (paymentStatus === 'successful' || paymentStatus === 'success') paymentStatus = 'completed';
    else if (['failed', 'cancelled', 'rejected', 'expired'].includes(paymentStatus))
      paymentStatus = 'failed';

    try {
      const [payments] = await pool.query('SELECT id, order_id, amount, phone_number FROM payments WHERE reference = ?', [
        reference,
      ]);
      const payment = payments[0];
      if (!payment) {
        console.log('[Payment] Webhook – payment not found for reference:', reference);
        return res.status(200).json({ success: true, message: 'Payment not found, acknowledged' });
      }

      console.log('[Payment] Webhook – updating payment reference:', reference, 'status:', paymentStatus);
      await pool.query(
        'UPDATE payments SET status = ?, transaction_uuid = ?, provider_reference = ?, webhook_data = ?, updated_at = NOW() WHERE reference = ?',
        [
          paymentStatus,
          transaction.uuid || null,
          transaction.provider_reference || null,
          JSON.stringify(body),
          reference,
        ]
      );

      if (paymentStatus === 'completed') {
        console.log('[Payment] Webhook – payment completed, confirming order_id:', payment.order_id);
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['confirmed', payment.order_id]);
        const amountFmt = (collection?.amount?.formatted) || `${payment.amount} UGX`;
        await sendTelegramMessage(
          `🎉 Payment completed\nOrder #${payment.order_id}\nAmount: ${amountFmt}\nPhone: ${payment.phone_number}\nRef: ${reference}`
        );
      } else if (paymentStatus === 'failed') {
        await sendTelegramMessage(
          `❌ Payment failed\nOrder #${payment.order_id}\nRef: ${reference}\nStatus: ${paymentStatus}`
        );
      }

      return res.status(200).json({ success: true, reference, status: paymentStatus });
    } catch (err) {
      console.error('Webhook marzpay error:', err);
      return res.status(200).json({ success: false, error: err.message });
    }
  });

  return router;
};
