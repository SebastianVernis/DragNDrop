/**
 * Database Client Configuration
 * Drizzle ORM with PostgreSQL
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
const queryClient = postgres(connectionString);

// Create Drizzle instance
export const db = drizzle(queryClient, { schema });

// Test connection
export async function testConnection() {
  try {
    await queryClient`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await queryClient.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await queryClient.end();
  process.exit(0);
});

export default db;
