import express from 'express';
import { authenticateToken } from './auth-middleware.js';

export default (pool) => {
  const router = express.Router();

  // Get user's wishlist
  router.get('/wishlist', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const [wishlistItems] = await pool.query(`
        SELECT 
          w.id as wishlist_id,
          w.created_at as added_at,
          p.id,
          p.name,
          p.price,
          p.image,
          p.category,
          p.description,
          p.unit,
          p.inStock
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
      `, [userId]);

      res.json(wishlistItems);
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch wishlist', details: err.message });
    }
  });

  // Add product to wishlist
  router.post('/wishlist/:productId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.productId);

      // Check if product exists
      const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if already in wishlist
      const [existing] = await pool.query(
        'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Product already in wishlist' });
      }

      // Add to wishlist
      await pool.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
      );

      res.status(201).json({ message: 'Product added to wishlist successfully' });
    } catch (err) {
      console.error('Add to wishlist error:', err);
      res.status(500).json({ error: 'Failed to add to wishlist', details: err.message });
    }
  });

  // Remove product from wishlist
  router.delete('/wishlist/:productId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.productId);

      const [result] = await pool.query(
        'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found in wishlist' });
      }

      res.json({ message: 'Product removed from wishlist successfully' });
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      res.status(500).json({ error: 'Failed to remove from wishlist', details: err.message });
    }
  });

  // Check if product is in user's wishlist
  router.get('/wishlist/check/:productId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.productId);

      const [existing] = await pool.query(
        'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      res.json({ inWishlist: existing.length > 0 });
    } catch (err) {
      console.error('Wishlist check error:', err);
      res.status(500).json({ error: 'Failed to check wishlist status', details: err.message });
    }
  });

  // Clear entire wishlist
  router.delete('/wishlist', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;

      await pool.query('DELETE FROM wishlist WHERE user_id = ?', [userId]);

      res.json({ message: 'Wishlist cleared successfully' });
    } catch (err) {
      console.error('Clear wishlist error:', err);
      res.status(500).json({ error: 'Failed to clear wishlist', details: err.message });
    }
  });

  return router;
};
