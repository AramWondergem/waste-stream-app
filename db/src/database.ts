import { Database } from './types'
import { createKysely } from '@vercel/postgres-kysely'

require('dotenv').config({path: '.env.local'});

export const db = createKysely<Database>({

  connectionString: process.env.POSTGRES_URL,
});