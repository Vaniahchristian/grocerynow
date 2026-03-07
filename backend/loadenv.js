/**
 * Load .env before any other app code runs.
 * Must be the first import in index.js so process.env is set before routes (e.g. paymentroutes) read it.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath, override: true });
if (result.error && process.env.NODE_ENV !== 'production') {
  console.warn('[loadenv] .env load warning:', result.error.message);
}
