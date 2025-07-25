import pg from 'postgres';
import { env } from '../env.ts';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema as Schemas } from './schema/index.ts';

export const sql = pg(env.DATABASE_URL);

export const db = drizzle(sql, {
  schema: Schemas,
  casing: 'snake_case',
});


