import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { authenticateToken, generateToken } from './auth-middleware.js';

export default (pool) => {
  const router = express.Router();

  // User Registration
  router.post('/auth/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 1 }),
    body('lastName').trim().isLength({ min: 1 })
  ], async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      const { email, password, firstName, lastName, phone, address, city, postalCode } = req.body;

      // Check if user already exists
      const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return res.status(409).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const [result] = await pool.query(
        'INSERT INTO users (email, password, first_name, last_name, phone, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, phone || null, address || null, city || null, postalCode || null]
      );

      // Get the created user (without password)
      const [newUser] = await pool.query(
        'SELECT id, email, first_name, last_name, phone, address, city, postal_code, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      // Generate JWT token
      const token = generateToken(newUser[0]);

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser[0],
        token
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  });

  // User Login
  router.post('/auth/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ], async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

  // Get Current User Profile
  router.get('/auth/profile', authenticateToken, async (req, res) => {
    try {
      const [users] = await pool.query(
        'SELECT id, email, first_name, last_name, phone, address, city, postal_code, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: users[0] });
    } catch (err) {
      console.error('Profile fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
  });

  // Update User Profile
  router.put('/auth/profile', authenticateToken, [
    body('firstName').optional().trim().isLength({ min: 1 }),
    body('lastName').optional().trim().isLength({ min: 1 }),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('postalCode').optional().trim()
  ], async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      const { firstName, lastName, phone, address, city, postalCode } = req.body;
      const userId = req.user.id;

      // Update user profile
      await pool.query(
        'UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone), address = COALESCE(?, address), city = COALESCE(?, city), postal_code = COALESCE(?, postal_code), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [firstName, lastName, phone, address, city, postalCode, userId]
      );

      // Get updated user data
      const [users] = await pool.query(
        'SELECT id, email, first_name, last_name, phone, address, city, postal_code, updated_at FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        message: 'Profile updated successfully',
        user: users[0]
      });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Failed to update profile', details: err.message });
    }
  });

  // Change Password
  router.put('/auth/change-password', authenticateToken, [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 })
  ], async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get current user with password
      const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await pool.query(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedNewPassword, userId]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Password change error:', err);
      res.status(500).json({ error: 'Failed to change password', details: err.message });
    }
  });

  // Get All Users (Admin only - for future use)
  router.get('/users', authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, email, first_name, last_name, phone, city, is_active, created_at FROM users ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (err) {
      console.error('Users fetch error:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  return router;
};
