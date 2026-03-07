import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'grocery_now',
      multipleStatements: true
    });

    console.log('Connected to MySQL database successfully!');

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'create_offers_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL commands
    console.log('Creating offers table...');
    await connection.execute(sqlContent);
    
    console.log('✅ Offers table created successfully!');
    console.log('✅ Sample data inserted successfully!');
    
    // Verify the table was created
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM offers');
    console.log(`📊 Total offers in database: ${rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
setupDatabase();
