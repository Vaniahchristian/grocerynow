# Database Setup for Grocery Now Store

This folder contains the database setup scripts for the offers functionality.

## Files

- `create_offers_table.sql` - SQL script to create the offers table with sample data
- `setup_database.js` - Node.js script to automatically run the SQL setup
- `README.md` - This file with setup instructions

## Offers Table Structure

The `offers` table includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | INT (Primary Key) | Auto-incrementing unique identifier |
| `title` | VARCHAR(255) | Offer title/name |
| `description` | TEXT | Detailed offer description |
| `image` | VARCHAR(500) | URL to offer image |
| `discount` | VARCHAR(100) | Discount text (e.g., "15% OFF", "FREE EGGS") |
| `category` | VARCHAR(100) | Product category for the offer |
| `link` | VARCHAR(255) | Link to related products/pages |
| `isActive` | BOOLEAN | Whether the offer is currently active |
| `created_at` | TIMESTAMP | When the offer was created |
| `updated_at` | TIMESTAMP | When the offer was last updated |

## Setup Options

### Option 1: Automatic Setup (Recommended)

Run the Node.js setup script from the database folder:

```bash
cd database
node setup_database.js
```

### Option 2: Manual Setup

1. Connect to your MySQL database using your preferred client (phpMyAdmin, MySQL Workbench, command line, etc.)

2. Make sure you're using the correct database:
   ```sql
   USE grocery_now;
   ```

3. Copy and paste the contents of `create_offers_table.sql` into your MySQL client and execute it.

### Option 3: Command Line MySQL

```bash
mysql -u root -p grocery_now < create_offers_table.sql
```

## Sample Data

The setup script includes 6 sample offers covering different product categories:

1. **Weekend Freshness Deal** - 15% off Fresh Produce
2. **Dairy & Eggs Bundle** - Free eggs with dairy purchase
3. **Bulk Pantry Savings** - 10% off bulk pantry items
4. **Meat Lover's Special** - 20% off meat & seafood
5. **Beverage Bonanza** - Buy 2 get 1 free beverages
6. **Snack Attack Deal** - 5 snacks for UGX 25,000

## Verification

After setup, you can verify the table was created successfully:

```sql
-- Check table structure
DESCRIBE offers;

-- Check sample data
SELECT id, title, discount, category, isActive FROM offers;

-- Count total offers
SELECT COUNT(*) as total_offers FROM offers WHERE isActive = TRUE;
```

## Environment Variables

Make sure your `.env` file in the backend folder contains:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_now
PORT=4000
```

## Troubleshooting

- **Connection Error**: Check your database credentials in the `.env` file
- **Table Already Exists**: The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- **Permission Error**: Make sure your MySQL user has CREATE and INSERT privileges
- **Database Not Found**: Create the `grocery_now` database first if it doesn't exist

## Next Steps

After setting up the offers table:

1. Start your backend server: `npm start` (from the backend folder)
2. Start your frontend: `npm run dev` (from the root folder)
3. Visit your application to see the offers section populated with real data from the database!
