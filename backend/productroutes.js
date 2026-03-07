import express from 'express';
import upload from './upload-middleware.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Serve uploaded files statically
router.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));

export default (pool) => {
  // Get all products
  router.get('/products', async (req, res) => {
    try {
      const { category, exclude, limit } = req.query;

      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (exclude) {
        query += ' AND id != ?';
        params.push(exclude);
      }

      if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit));
      }

      const [rows] = await pool.query(query, params);
      res.json(rows);
      console.log("products", rows.length, "found");
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Get single product by ID
  router.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // Add more endpoints here (e.g., users, orders)

  // add new product with image upload
  router.post('/products', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 20 }
  ]), async (req, res) => {
    try {
      const { name, price, category, description, unit, inStock } = req.body;
      try {
        console.log('POST /products incoming', {
          contentType: req.headers['content-type'],
          body: { name, price, category, description, unit, inStock },
          files: Object.fromEntries(Object.entries(req.files || {}).map(([k, v]) => [k, Array.isArray(v) ? v.map(f => ({ name: f.originalname, size: f.size })) : v]))
        });
      } catch {}

      const imageFile = Array.isArray(req.files?.image) && req.files.image.length > 0 ? req.files.image[0] : null;
      let imagePath = imageFile ? `/api/uploads/${imageFile.filename}` : null;

      // Collect additional uploaded images (array)
      const additionalFiles = Array.isArray(req.files?.additionalImages) ? req.files.additionalImages : [];
      const uploadedAdditionalPaths = additionalFiles.map(f => `/api/uploads/${f.filename}`);

      const parsedPrice = (() => { try { return parseFloat(price) } catch { return NaN } })();
      const normalizedInStock = (inStock === 'true' || inStock === true || inStock === 1 || inStock === '1');
      try {
        console.log('POST /products computed', { imagePath, parsedPrice, normalizedInStock });
        console.log('POST /products SQL values', [name, parsedPrice, category, description, unit, normalizedInStock ? 1 : 0, imagePath]);
      } catch {}

      const [cols] = await pool.query('DESCRIBE products');
      const has = (c) => Array.isArray(cols) && cols.some(col => col.Field === c);
      const columns = ['name', 'price', 'category', 'description', 'unit', 'inStock', 'image'];
      const values = [name, parsedPrice, category, description, unit, normalizedInStock ? 1 : 0, imagePath];

      // Build images array by combining any URLs from body with uploaded additional images
      let bodyImages = [];
      if (typeof req.body.images === 'string' && req.body.images.trim()) {
        try {
          const parsed = JSON.parse(req.body.images);
          if (Array.isArray(parsed)) bodyImages = parsed.filter(x => typeof x === 'string');
        } catch {}
      }
      const combinedImages = [...bodyImages, ...uploadedAdditionalPaths];
      if (has('images') && combinedImages.length > 0) {
        columns.push('images');
        values.push(JSON.stringify(combinedImages));
      }
      if (has('variants') && req.body.variants) {
        columns.push('variants');
        values.push(req.body.variants);
      }

      const placeholders = columns.map(() => '?').join(', ');
      const [result] = await pool.query(`INSERT INTO products (${columns.join(', ')}) VALUES (${placeholders})`, values);

      const responsePayload = { id: result.insertId, name, price: parsedPrice, category, description, unit, inStock: normalizedInStock ? 1 : 0, image: imagePath };
      if (has('images') && combinedImages.length > 0) responsePayload.images = combinedImages;
      if (has('variants') && req.body.variants) responsePayload.variants = req.body.variants;
      res.json(responsePayload);
    } catch (err) {
      try {
        console.error('POST /products error', {
          message: err?.message,
          code: err?.code,
          errno: err?.errno,
          sqlState: err?.sqlState,
          sqlMessage: err?.sqlMessage,
          stack: err?.stack
        });
      } catch {}
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // update product (partial update)
  router.patch('/products/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 20 }
  ]), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      console.log('PATCH /products/:id - Request data:', { id, updates, file: req.file });
      
      // Handle image upload if new file provided
      const imageFile = Array.isArray(req.files?.image) && req.files.image.length > 0 ? req.files.image[0] : null;
      if (imageFile) {
        const imagePath = `/api/uploads/${imageFile.filename}`;
        updates.image = imagePath;
      }

      // Handle additional uploaded images and merge with any body 'images' URLs
      const additionalFiles = Array.isArray(req.files?.additionalImages) ? req.files.additionalImages : [];
      const uploadedAdditionalPaths = additionalFiles.map(f => `/api/uploads/${f.filename}`);
      let bodyImages = [];
      if (typeof updates.images === 'string' && updates.images.trim()) {
        try {
          const parsed = JSON.parse(updates.images);
          if (Array.isArray(parsed)) bodyImages = parsed.filter(x => typeof x === 'string');
        } catch {}
      }
      const combinedImages = [...bodyImages, ...uploadedAdditionalPaths];
      if (combinedImages.length > 0) {
        updates.images = JSON.stringify(combinedImages);
      } else {
        // If images was provided but empty string, remove to avoid wiping column unintentionally
        if (Object.prototype.hasOwnProperty.call(updates, 'images') && (!updates.images || updates.images === '')) {
          delete updates.images;
        }
      }
      
      // Convert data types for database
      if (updates.price) {
        updates.price = parseFloat(updates.price);
      }
      if (updates.inStock !== undefined) {
        updates.inStock = updates.inStock === 'true' || updates.inStock === true;
      }
      
      // Build dynamic query based on provided fields
      const [cols] = await pool.query('DESCRIBE products');
      const columnNames = Array.isArray(cols) ? cols.map(c => c.Field) : [];
      const baseFields = ['name', 'price', 'category', 'description', 'unit', 'inStock', 'image'];
      const optionalFields = ['images', 'variants'];
      const allowedFields = [...baseFields, ...optionalFields.filter(f => columnNames.includes(f))];
      const fieldsToUpdate = [];
      const values = [];
      
      // Only include fields that are actually provided in the request
      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(updates, field)) {
          fieldsToUpdate.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }
      
      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
      }
      
      // Add the id to the end of values array for the WHERE clause
      values.push(id);
      
      const query = `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      console.log('SQL Query:', query, 'Values:', values);
      const [result] = await pool.query(query, values);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Fetch the updated product to return complete data
      const [updatedProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      res.json(updatedProduct[0]);
    } catch (err) {
      console.error('PATCH /products/:id - Error:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // delete products 
  router.delete('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      res.json({ id });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  return router;
};
