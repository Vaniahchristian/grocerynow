import express from 'express';

export default (pool) => {
  const router = express.Router();

  // Get all categories
  router.get('/categories', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM categories');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Add more category endpoints as needed

  return router;
};
