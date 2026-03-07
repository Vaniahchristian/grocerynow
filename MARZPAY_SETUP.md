# MarzPay Payment Integration (Grocery Store)

This project uses **MarzPay** for mobile money (MTN & Airtel) collection, aligned with the implementation in the newyear (DatePulse) project.

## Environment variables

Add these to your **backend** `.env` (e.g. `backend/.env`):

```env
# MarzPay (mobile money)
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
MARZPAY_API_CREDENTIALS=<your-base64-credentials>

# Public app URL (used as webhook callback base)
APP_URL=https://your-domain.com

# Optional: Telegram notifications on payment completed/failed
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- **MARZPAY_API_CREDENTIALS**: Base64 of `api_key:api_secret` (e.g. from MarzPay dashboard).
- **APP_URL**: Base URL of your app so the webhook URL is `APP_URL/api/webhooks/marzpay`. For local dev you can use an ngrok URL.

## Database

Run the payments migration (MySQL):

```bash
mysql -u your_user -p your_database < scripts/migrations/create_payments_table.sql
```

Or run the SQL in `scripts/migrations/create_payments_table.sql` in your MySQL client.

## API endpoints (backend)

| Method | Path | Purpose |
|--------|------|--------|
| POST | `/api/payments/collect` | Initiate mobile money collection (body: `amount`, `phone_number`, `order_id`, `description?`) |
| GET | `/api/payments/status/:reference` | Poll payment status (used after collect) |
| POST | `/api/webhooks/marzpay` | MarzPay callback; updates payment status and order to `confirmed` when payment completes |

## Webhook URL (MarzPay dashboard)

Set the webhook URL in MarzPay to:

```
https://your-domain.com/api/webhooks/marzpay
```

The backend must be reachable at that URL (same host as your API or behind a proxy).

## Flow

1. Customer places order → order is created.
2. In the confirmation dialog they can choose **Pay with Mobile Money**: select MTN or Airtel, enter phone, click “Pay UGX … now”.
3. Frontend calls `POST /api/payments/collect` with `order_id`, `amount`, `phone_number`.
4. Backend calls MarzPay collect-money and inserts a row in `payments`.
5. Customer approves the prompt on their phone.
6. MarzPay sends a callback to `POST /api/webhooks/marzpay`; backend updates `payments.status` and sets `orders.status` to `confirmed` when status is completed.
7. Frontend polls `GET /api/payments/status/:reference` until status is `completed` or `failed`, then shows success or error.

## Testing locally

See **[LOCAL_TESTING.md](./LOCAL_TESTING.md)** for a full step-by-step guide (database, env, running backend/frontend, ngrok for webhook, and test flow).

- Use valid Uganda numbers (07… or 03… / +256…).
- Ensure MarzPay collection services for Uganda are enabled in your MarzPay account.
- For local testing, expose your backend with ngrok and set `APP_URL` to the ngrok URL so MarzPay can reach the webhook.
