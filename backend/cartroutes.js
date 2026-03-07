import express from 'express';

export default function cartroutes(pool) {
  const router = express.Router();

  // Helper: Get or create cart for user
  async function getOrCreateCart(userId) {
    // Try to find existing cart
    const [rows] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (rows.length > 0) return rows[0].id;
    // Create new cart
    const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }

  // Get all items in user's cart
  router.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const [cartRows] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
      if (cartRows.length === 0) return res.json({ items: [] });
      const cartId = cartRows[0].id;
      const [items] = await pool.query(
        `SELECT ci.id, ci.product_id, ci.quantity, ci.price_at_time, p.name, p.image, p.unit, p.category
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ?`,
        [cartId]
      );
      res.json({ items });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Add or update an item in the cart
  router.post('/cart/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;

      // Validate that product exists first
      const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
      if (products.length === 0) {
        console.log(`Attempt to add non-existent product ${productId} to cart`);
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = products[0];

      // Check if cart exists for user
      let [carts] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
      let cartId;

      if (carts.length === 0) {
        // Create new cart
        const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        cartId = result.insertId;
      } else {
        cartId = carts[0].id;
      }

      // Check if item already exists in cart
      const [existingItems] = await pool.query(
        'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
      );

      if (existingItems.length > 0) {
        // Update quantity
        await pool.query(
          'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
          [quantity, cartId, productId]
        );
      } else {
        // Add new item
        await pool.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
          [cartId, productId, quantity, product.price]
        );
      }

      res.json({ message: 'Item added to cart successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Remove a specific item from the cart
  router.delete('/cart/:userId/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;
    try {
      // Optionally, check cart ownership
      await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Clear the entire cart
  router.delete('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const [cartRows] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
      if (cartRows.length === 0) return res.json({ success: true });
      const cartId = cartRows[0].id;
      await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  return router;
} 