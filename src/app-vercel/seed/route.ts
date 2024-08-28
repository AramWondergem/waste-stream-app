import { sql } from 'kysely'
import { db } from '../../../db/src/database'
import * as JurisdictionRepository from '../../../db/src/JurisdictionRepository'
import * as BusinessRepository from '../../../db/src/BusinessRepository'


async function createTables() {
  await db.schema
    .createTable('jurisdiction').ifNotExists()
    .addColumn('jurisdiction_id', 'serial', (col) => col.notNull().primaryKey()) // PostgreSQL doesn't support autoincrement, use serial
    .addColumn('county_id', 'integer', (col) => col.notNull())
    .addColumn('name', sql`bpchar`, (col) => col.notNull())
    .addColumn('lon', 'numeric(9, 6)', (col) => col.notNull())
    .addColumn('lat', 'numeric(8, 6)', (col) => col.notNull())
    // .addForeignKeyConstraint('jurisdiction_county_id_fk', ['county_id'], 'county', ['county_id']) // TODO - uncomment when we've defined the county table
    .execute();

  await db.schema
      .createTable('business').ifNotExists()
      .addColumn('business_id', 'serial', (col) => col.notNull().primaryKey()) // PostgreSQL doesn't support autoincrement, use serial
      .addColumn('business_group_id', 'integer', (col) => col.notNull())
      .addColumn('jurisdiction_id', 'integer', (col) => col.notNull())
      .addColumn('name', sql`bpchar`, (col) => col.notNull())
      .addColumn('description', sql`bpchar`, (col) => col.notNull())
      .addColumn('phone_number', sql`bpchar`, (col) => col.notNull())
      .addColumn('lon', 'numeric(9, 6)', (col) => col.notNull())
      .addColumn('lat', 'numeric(8, 6)', (col) => col.notNull())
      .addForeignKeyConstraint('business_jurisdiction_id_fk', ['jurisdiction_id'], 'jurisdiction', ['jurisdiction_id'])
      // .addForeignKeyConstraint('business_business_group_id_fk', ['business_group_id'], 'business_group', ['business_group_id']) // TODO - uncomment when we've defined the business group table
      .execute();

    // TODO - other tables
}

async function seedData() {
  // TODO - actual data, this is dummy stuff for testing  
  
  await JurisdictionRepository.createJurisdiction({
    county_id: 123,
    name: 'test',
    lon: 123.456789,
    lat: 12.345678,
  })

  await BusinessRepository.createBusiness({
    business_group_id: 123,
    jurisdiction_id: 1,
    name: 'test',
    description: 'testing',
    phone_number: '111-1111',
    lon: 123.456789,
    lat: 12.345678,
  })
}


// Can get rid of this when things work - just need it to actually print out some errors sometimes for some reason
function ensureError(value: unknown): Error {
  if (value instanceof Error) return value

  let stringified = '[Unable to stringify the thrown value]'
  try {
    stringified = JSON.stringify(value)
  } catch {}

  const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`)
  return error
}


export async function GET() {
  try {
    await createTables()
    await seedData()

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    // TODO - roll back anything the database did?
    console.log("here")
    let definitely_error = ensureError(error)
    let message = definitely_error.message
    return Response.json( { message }, { status: 500 })
  }
}
