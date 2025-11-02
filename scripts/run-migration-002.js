#!/usr/bin/env node

/**
 * Migration script to add missing columns to users table
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
    const migrationPath = path.join(__dirname, '..', 'migrations', '002_add_missing_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration to add missing columns...');
    
    // Execute the entire migration as one transaction
    await sql.unsafe(migrationSQL);

    console.log('✅ Migration completed successfully!');

    // Verify columns exist
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    console.log('\n📋 Users table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Check required columns
    const requiredColumns = ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'is_active'];
    const existingColumns = columns.map(c => c.column_name);
    const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

    if (missingColumns.length > 0) {
      console.log('\n⚠️  Missing columns:', missingColumns.join(', '));
    } else {
      console.log('\n✅ All required columns exist!');
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
