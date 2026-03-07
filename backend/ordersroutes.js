import express from 'express';
import fetch from 'node-fetch'; // Required if Node < 18

export default (pool) => {
  const router = express.Router();

  // 🧩 Telegram bot configuration
  const TELEGRAM_BOT_TOKEN = '8316072456:AAHvb43asFN-bYHG5mcUXKJoDEfZtWOf8U0';
  const TELEGRAM_CHAT_IDS = ['1799637604', '5175475526']; // Add more chat IDs if needed

  // 🧩 Helper: Send Telegram message to all recipients
  const sendTelegramMessage = async (text) => {
    for (const chatId of TELEGRAM_CHAT_IDS) {
      try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            // Intentionally omit parse_mode to avoid Markdown parse errors breaking delivery
          }),
        });

        const rawBody = await resp.text();
        let data;
        try {
          data = rawBody ? JSON.parse(rawBody) : null;
        } catch (_) {
          data = null;
        }

        if (!resp.ok || (data && data.ok === false)) {
          console.error('Telegram send failed', {
            status: resp.status,
            httpOk: resp.ok,
            tgOk: data?.ok,
            description: data?.description,
            errorCode: data?.error_code,
            chatId,
            body: data ?? rawBody,
          });
        } else {
          console.log('Telegram message sent', { chatId });
        }
      } catch (err) {
        console.error('Failed to send Telegram message:', err.message);
      }
    }
  };

  // 🧮 Get total revenue
  router.get('/orders/total-revenue', async (req, res) => {
    try {
      const [result] = await pool.query('SELECT SUM(total) AS totalRevenue FROM orders');
      res.json({ totalRevenue: result[0].totalRevenue || 0 });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 🧾 Get all orders with items
  router.get('/orders', async (req, res) => {
    try {
      const [orders] = await pool.query(`
        SELECT 
          o.id,
          o.customerName,
          o.phone,
          o.location,
          o.deliveryZone,
          o.notes,
          o.status,
          o.subtotal,
          o.deliveryFee,
          o.total,
          o.createdAt
        FROM orders o
        ORDER BY o.createdAt DESC
      `);

      for (let order of orders) {
        const [items] = await pool.query(`
          SELECT 
            oi.quantity,
            oi.price,
            p.name as productName,
            p.id as productId
          FROM order_items oi
          JOIN products p ON oi.productId = p.id
          WHERE oi.orderId = ?
        `, [order.id]);
        order.items = items;
      }

      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 🛍️ Create new order
  router.post('/orders', async (req, res) => {
    try {
      const { customerName, phone, location, zone, notes, items } = req.body;
      console.log('Incoming order payload:', JSON.stringify(req.body, null, 2));

      const productIds = items.map(item => item.productId);
      const [existingProducts] = await pool.query(
        'SELECT id FROM products WHERE id IN (?)',
        [productIds]
      );
      const existingIds = new Set(existingProducts.map(p => p.id));
      const missingIds = productIds.filter(id => !existingIds.has(id));

      if (missingIds.length > 0) {
        console.log('Missing product IDs:', missingIds);
        return res.status(400).json({
          error: `Product(s) not found in database: ${missingIds.join(', ')}. Please refresh your cart.`
        });
      }

      // 🧮 Calculate subtotal
      let subtotal = 0;
      for (const item of items) {
        subtotal += item.price * item.quantity;
      }

      // 🛵 Compute delivery fee
      const computeDeliveryFee = (deliveryZone, deliveryLocation) => {
        const z = (deliveryZone || '').trim().toLowerCase();
        const l = (deliveryLocation || '').trim().toLowerCase();
        const key = z || l;
        switch (key) {
          case 'kampala central':
            return 7000;
          case 'wakiso':
            return 10000;
          default:
            return 10000;
        }
      };

      const deliveryZone = zone || null;
      const deliveryFee = computeDeliveryFee(deliveryZone, location);
      const total = subtotal + deliveryFee;

      // 💾 Insert order
      const [orderResult] = await pool.query(
        `INSERT INTO orders 
          (customerName, phone, location, deliveryZone, notes, status, subtotal, deliveryFee, total, createdAt)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, NOW())`,
        [customerName, phone, location, deliveryZone, notes || null, subtotal, deliveryFee, total]
      );

      const orderId = orderResult.insertId;
      console.log('Order inserted with ID:', orderId);

      // 💾 Insert items
      for (const item of items) {
        await pool.query(
          'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      // 📦 Fetch the complete new order
      const [newOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      const [orderItems] = await pool.query(`
        SELECT 
          oi.quantity,
          oi.price,
          p.name as productName,
          p.id as productId
        FROM order_items oi
        JOIN products p ON oi.productId = p.id
        WHERE oi.orderId = ?
      `, [orderId]);

      newOrder[0].items = orderItems;

      // 🟢 Send Telegram notification
      const order = newOrder[0];
      let message = `🛍️ *New Order Received!*\n\n`;
      message += `👤 *Name:* ${order.customerName}\n📞 *Phone:* ${order.phone}\n📍 *Location:* ${order.location}\n🚚 *Zone:* ${order.deliveryZone}\n`;
      message += `🛵 *Delivery Fee:* ${order.deliveryFee.toLocaleString()} UGX\n`;
      message += `💰 *Total:* ${order.total.toLocaleString()} UGX\n\n*Items:*\n`;
      for (const item of orderItems) {
        message += `- ${item.productName} x${item.quantity} @ ${item.price.toLocaleString()} UGX\n`;
      }
      if (order.notes) message += `\n📝 *Notes:* ${order.notes}`;
      await sendTelegramMessage(message);

      // ✅ Return the new order
      res.json(newOrder[0]);
      console.log('Order successfully created:', JSON.stringify(newOrder[0], null, 2));
    } catch (err) {
      console.error('Order creation error:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 🟡 Update order status
  router.patch('/orders/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'delivered'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      res.json(updatedOrder[0]);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 🔍 Get single order
  router.get('/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
      if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

      const order = orders[0];
      const [items] = await pool.query(`
        SELECT 
          oi.quantity,
          oi.price,
          p.name as productName,
          p.id as productId
        FROM order_items oi
        JOIN products p ON oi.productId = p.id
        WHERE oi.orderId = ?
      `, [id]);

      order.items = items;
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 🧹 Clear all orders
  router.delete('/orders', async (req, res) => {
    try {
      await pool.query('DELETE FROM order_items');
      await pool.query('DELETE FROM orders');
      res.json({ message: 'All orders cleared successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // ❌ Delete single order
  router.delete('/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM order_items WHERE orderId = ?', [id]);
      const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ id, message: 'Order deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  return router;
};
