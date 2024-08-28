import { Database } from './types'
import { createKysely } from '@vercel/postgres-kysely'

require('dotenv').config({path: '.env.local'});

// console.log({POSTGRES_URL: process.env.POSTGRES_URL})



export const db = createKysely<Database>({

  connectionString: process.env.POSTGRES_URL,
});