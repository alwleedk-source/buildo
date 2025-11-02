#!/usr/bin/env node

/**
 * Migration script to create users table
 * This script should be run on Railway using the DATABASE_URL environment variable
 */

const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    console.log('This script must be run on Railway or with DATABASE_URL set');
    process.exit(1);
  }

  try {
    // Import postgres after checking DATABASE_URL
    const postgres = require('postgres');
    
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1
    });

    console.log('Connected to database...');

    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_users_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration...');
    
    // Split by semicolon and run each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      await sql.unsafe(statement);
    }

    console.log('✅ Migration completed successfully!');

    // Verify users table exists
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `;

    if (result.length > 0) {
      console.log('✅ Users table verified');
      
      // Check if admin user exists
      const users = await sql`
        SELECT email FROM users WHERE email = 'waleed.qodami@gmail.com'
      `;
      
      if (users.length > 0) {
        console.log('✅ Admin user exists');
      } else {
        console.log('⚠️  Admin user not found');
      }
    } else {
      console.log('❌ Users table not found after migration');
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
