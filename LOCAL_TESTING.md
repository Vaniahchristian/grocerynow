# How to Test Locally (Including MarzPay Payments)

Follow these steps to run the app and test mobile money payments on your machine.

---

## 1. Prerequisites

- **Node.js** (v18+)
- **MySQL** running with the app database
- **MarzPay** API credentials (from MarzPay dashboard)
- **ngrok** (optional but needed for webhook when testing real payments): [ngrok.com](https://ngrok.com)

---

## 2. Database: Create the payments table

If you haven’t already, run the payments migration:

```bash
# From project root (adjust user and database name)
mysql -u root -p your_database_name < scripts/migrations/create_payments_table.sql
```

Or open `scripts/migrations/create_payments_table.sql` in MySQL Workbench / any client and run it.

---

## 3. Backend environment (local)

Create or edit **`backend/.env`** with at least:

```env
# Database (same as your current setup)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_now
DB_PORT=3306
PORT=4000

# MarzPay (use your real credentials)
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
MARZPAY_API_CREDENTIALS=your_base64_credentials

# For local testing: use ngrok URL so MarzPay can call your webhook (see step 6)
APP_URL=https://your-ngrok-url.ngrok-free.app

# Optional: Telegram on payment events
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- **APP_URL**: For the webhook to work, MarzPay must reach your backend. Locally that means using **ngrok** and putting the ngrok URL here (e.g. `https://abc123.ngrok-free.app`). If you only test “initiate payment” and don’t care about webhook yet, you can set `APP_URL=http://localhost:4000` temporarily.

---

## 4. Frontend environment (point to local backend)

Create or edit **`.env.local`** in the **project root** (next to `package.json`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

This makes the Next.js app call your **local** backend instead of the VPS. Without it, the app would still use the rewrite in `next.config.mjs` (VPS).

---

## 5. Run backend and frontend

**Terminal 1 – Backend**

```bash
cd backend
npm install
node index.js
```

You should see something like: `Server running on http://localhost:4000`.

**Terminal 2 – Frontend**

```bash
# From project root
npm install
npm run dev
```

You should see: `Ready on http://localhost:3000`.

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:4000/api/...**

---

## 6. Webhook for real payments (ngrok)

MarzPay calls your backend at `APP_URL/api/webhooks/marzpay`. On your PC that URL must be **public**.

1. Install ngrok: [ngrok.com/download](https://ngrok.com/download)
2. Expose port **4000** (where the backend runs):

   ```bash
   ngrok http 4000
   ```

3. Copy the **HTTPS** URL ngrok shows (e.g. `https://abc123.ngrok-free.app`).
4. In **`backend/.env`** set:

   ```env
   APP_URL=https://abc123.ngrok-free.app
   ```

5. In the **MarzPay dashboard**, set the webhook URL to:

   ```text
   https://abc123.ngrok-free.app/api/webhooks/marzpay
   ```

6. Restart the backend so it picks up the new `APP_URL`.

Then when you complete a payment on your phone, MarzPay will call this URL and your local backend will receive the webhook.

---

## 7. Test the payment flow

1. Open **http://localhost:3000**
2. Add products to the cart and go to **Checkout**
3. Fill delivery details, choose **Pay 80% Deposit** or **Pay Full Amount**, accept the policy, click **Place Order**
4. In the confirmation dialog, use **Pay with Mobile Money**:
   - Choose **MTN MoMo** or **Airtel Money**
   - Enter a valid Uganda number (e.g. `0754092850`)
   - Click **Pay UGX … now**
5. On your phone you should get a mobile money prompt; **approve** the payment
6. The dialog should change to “Waiting for approval” and then “Payment received” once the webhook is called (if ngrok and `APP_URL` are set correctly)

**If you don’t use ngrok:**  
Payment initiation and the “Waiting for approval” screen will still work, but the status may not update to “Payment received” because MarzPay cannot reach your local machine to send the webhook. In that case you can check the `payments` and `orders` tables in MySQL after approving on your phone; once the webhook is reachable (e.g. after deploying or using ngrok), the flow will complete end-to-end.

---

## 8. Quick checklist

| Step | What to do |
|------|------------|
| 1 | MySQL running, payments table created |
| 2 | `backend/.env` with DB_*, PORT, MARZPAY_*, APP_URL (ngrok URL for webhook) |
| 3 | `.env.local` in project root with `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| 4 | Backend: `cd backend && node index.js` (port 4000) |
| 5 | Frontend: `npm run dev` (port 3000) |
| 6 | (Optional) ngrok: `ngrok http 4000`, set APP_URL and MarzPay webhook to ngrok URL |
| 7 | Test: checkout → Place Order → Pay with Mobile Money → approve on phone |

---

## Troubleshooting

- **“Payment service not configured”**  
  Backend can’t find `MARZPAY_API_CREDENTIALS`. Check `backend/.env`.

- **Frontend still calls VPS / wrong API**  
  Ensure `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000` and restart `npm run dev` (env is read at build/dev start).

- **Payment initiated but status never becomes “Payment received”**  
  Webhook is not reaching your machine. Use ngrok, set `APP_URL` to the ngrok URL, set the same URL in MarzPay (with `/api/webhooks/marzpay`), and restart the backend.

- **Invalid phone / provider errors**  
  Use a valid Uganda number (e.g. 07xxxxxxxx or 03xxxxxxxx). Match provider: 07… often MTN, 075/074/070 Airtel, 03… Airtel.
