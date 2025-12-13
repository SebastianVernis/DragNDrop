/**
 * Drizzle Kit Configuration
 * For migrations and database management
 */

import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './db/schema.js',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};
