import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin role (optional for future use)
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};
