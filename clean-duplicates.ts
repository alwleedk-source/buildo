import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/db/schema';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function cleanDuplicates() {
  console.log('🧹 Cleaning duplicate services...');
  
  // Get all services grouped by titleNl
  const services = await db.select().from(schema.services);
  console.log(`Found ${services.length} services`);
  
  // Group by titleNl
  const grouped = new Map<string, typeof services>();
  services.forEach(service => {
    const key = service.titleNl;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(service);
  });
  
  console.log(`Found ${grouped.size} unique services`);
  
  // Keep only first of each group, delete the rest
  let deleted = 0;
  for (const [titleNl, group] of grouped) {
    if (group.length > 1) {
      // Keep first, delete rest
      const toDelete = group.slice(1);
      for (const service of toDelete) {
        await db.delete(schema.services).where(sql`id = ${service.id}`);
        deleted++;
      }
      console.log(`Kept 1, deleted ${toDelete.length} duplicates of "${titleNl}"`);
    }
  }
  
  console.log(`✅ Deleted ${deleted} duplicate services`);
  
  // Verify
  const remaining = await db.select().from(schema.services);
  console.log(`✅ Remaining services: ${remaining.length}`);
  
  await client.end();
}

cleanDuplicates().catch(console.error);
