import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './productroutes.js';
import usersroutes from './usersroutes.js';
import wishlistroutes from './wishlistroutes.js';
import offersroutes from './offersroutes.js';
import categoriesroutes from './categoriesroutes.js';           
import ordersroutes from './ordersroutes.js';
import paymentroutes from './paymentroutes.js';
import productroutes from './productroutes.js';
import upload from './upload-middleware.js';
import cartroutes from './cartroutes.js';

// Load .env from backend directory (so it works when run from project root or backend/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/api/uploads', express.static('uploads'));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grocery_now',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


app.use('/api', routes(pool));

app.use('/api', usersroutes(pool)); 

app.use('/api', wishlistroutes(pool));

app.use('/api', offersroutes(pool));

app.use('/api', categoriesroutes(pool));

app.use('/api', ordersroutes(pool));
app.use('/api', paymentroutes(pool));

app.use('/api', cartroutes(pool));


app.use('/api', productroutes(pool));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
