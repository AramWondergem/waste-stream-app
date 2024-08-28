import { sql } from 'kysely'
import { db } from '../../../db/src/database'
import * as JurisdictionRepository from '../../../db/src/JurisdictionRepository'
import * as BusinessRepository from '../../../db/src/BusinessRepository'
import * as CountyRepository from '../../../db/src/CountyRepository'
import * as BusinessGroupRepository from '../../../db/src/BusinessGroupRepository'
import * as DisposalTypeRepository from '../../../db/src/DisposalTypeRepository'
import * as MaterialTypeRepository from '../../../db/src/MaterialTypeRepository'
import * as BusinessDisposalRecordRepository from '../../../db/src/BusinessDisposalRecordRepository'
import * as GroupDisposalRecordRepository from '../../../db/src/GroupDisposalRecordRepository'


async function printTables() {
  const tables = await db
    .selectFrom('information_schema.tables')
    .select('table_name')
    .where('table_schema', '=', 'public')
    .execute();

  console.log("");
  console.log(tables);
  console.log("");
}


async function createTables() {
  await db.schema
    .createTable('county').ifNotExists()
    .addColumn('fips_code', 'integer', (col) => col.notNull().primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('lon', 'numeric(9, 6)', (col) => col.notNull())
    .addColumn('lat', 'numeric(8, 6)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('business_group').ifNotExists()
    .addColumn('group_id', 'serial', (col) => col.notNull().primaryKey())
    .addColumn('group_name', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('jurisdiction').ifNotExists()
    .addColumn('jurisdiction_id', 'serial', (col) => col.notNull().primaryKey()) // PostgreSQL doesn't support autoincrement, use serial
    .addColumn('county_id', 'integer', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('lon', 'numeric(9, 6)', (col) => col.notNull())
    .addColumn('lat', 'numeric(8, 6)', (col) => col.notNull())
    .addForeignKeyConstraint('jurisdiction_county_id_fk', ['county_id'], 'county', ['fips_code']) 
    .execute();

  await db.schema
    .createTable('business').ifNotExists()
    .addColumn('business_id', 'serial', (col) => col.notNull().primaryKey()) // PostgreSQL doesn't support autoincrement, use serial
    .addColumn('business_group_id', 'integer', (col) => col.notNull())
    .addColumn('jurisdiction_id', 'integer', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('phone_number', 'varchar', (col) => col.notNull())
    .addColumn('lon', 'numeric(9, 6)', (col) => col.notNull())
    .addColumn('lat', 'numeric(8, 6)', (col) => col.notNull())
    .addForeignKeyConstraint('business_jurisdiction_id_fk', ['jurisdiction_id'], 'jurisdiction', ['jurisdiction_id'])
    .addForeignKeyConstraint('business_business_group_id_fk', ['business_group_id'], 'business_group', ['group_id'])
    .execute();

  await db.schema
    .createTable('disposal_type').ifNotExists()
    .addColumn('disposal_type_id', 'serial', (col) => col.notNull().primaryKey())
    .addColumn('type_name', 'varchar', (col) => col.notNull())
    .execute();


  await db.schema
    .createTable('material_type').ifNotExists()
    .addColumn('material_type_id', 'serial', (col) => col.notNull().primaryKey())
    .addColumn('material_category', 'varchar', (col) => col.notNull())
    .addColumn('material_type', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('business_disposal_record').ifNotExists()
    .addColumn('business_id', 'integer', (col) => col.notNull())
    .addColumn('material_id', 'integer', (col) => col.notNull())
    .addColumn('disposal_type_id', 'integer', (col) => col.notNull())
    .addColumn('disposal_amount', 'numeric(8, 2)', (col) => col.notNull())
    .addPrimaryKeyConstraint('business_disposal_record_pk', ['business_id', 'material_id', 'disposal_type_id'])
    .addForeignKeyConstraint('business_disposal_record_business_id_fk', ['business_id'], 'business', ['business_id'])
    .addForeignKeyConstraint('business_disposal_record_material_id_fk', ['material_id'], 'material_type', ['material_type_id'])
    .addForeignKeyConstraint('business_disposal_record_disposal_type_id_fk', ['disposal_type_id'], 'disposal_type', ['disposal_type_id'])
    .execute();

  await db.schema
    .createTable('group_disposal_record').ifNotExists()
    .addColumn('material_id', 'integer', (col) => col.notNull())
    .addColumn('jurisdiction_id', 'integer', (col) => col.notNull())
    .addColumn('business_group_id', 'integer', (col) => col.notNull())
    .addColumn('disposal_type_id', 'integer', (col) => col.notNull())
    .addColumn('disposal_amount', 'numeric(8, 2)', (col) => col.notNull())
    .addPrimaryKeyConstraint('group_disposal_record_pk', ['material_id', 'jurisdiction_id', 'business_group_id', 'disposal_type_id'])
    .addForeignKeyConstraint('group_disposal_record_material_id_fk', ['material_id'], 'material_type', ['material_type_id'])
    .addForeignKeyConstraint('group_disposal_record_jurisdiction_id_fk', ['jurisdiction_id'], 'jurisdiction', ['jurisdiction_id'])
    .addForeignKeyConstraint('group_disposal_record_business_group_id_fk', ['business_group_id'], 'business_group', ['group_id'])
    .addForeignKeyConstraint('group_disposal_record_disposal_type_id_fk', ['disposal_type_id'], 'disposal_type', ['disposal_type_id'])
    .execute();

}

async function seedData() {
  // TODO - actual data, this is dummy stuff for testing  

  await CountyRepository.createCounty({
    fips_code: 123,
    name: 'county',
    lon: 123.456789,
    lat: 12.345678,
  })

  await BusinessGroupRepository.createBusinessGroup({
    group_name: 'group'
  })

  await JurisdictionRepository.createJurisdiction({
    county_id: 123,
    name: 'test',
    lon: 123.456789,
    lat: 12.345678,
  })

  await BusinessRepository.createBusiness({
    business_group_id: 1,
    jurisdiction_id: 1,
    name: 'test',
    description: 'testing',
    phone_number: '111-1111',
    lon: 123.456789,
    lat: 12.345678,
  })

  await DisposalTypeRepository.createDisposalType({
    type_name: 'disposal type',
  })

  await MaterialTypeRepository.createMaterialType({
    material_category: 'category',
    material_type: 'material type',
  })

  await BusinessDisposalRecordRepository.createBusinessDisposalRecord({
    business_id: 1,
    material_id: 1,
    disposal_type_id: 1,
    disposal_amount: 10000,
  })

  await GroupDisposalRecordRepository.createGroupDisposalRecord({
    material_id: 1,
    jurisdiction_id: 1,
    business_group_id: 1,
    disposal_type_id: 1,
    disposal_amount: 12345,
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


export async function dropAllTables() {
  // NOTE: need to do this in an order where a table isn't dropped until no other tables exist that depend on that table (e.g. reverse order to creation)

  await db.schema.dropTable('group_disposal_record').execute()
  await db.schema.dropTable('business_disposal_record').execute()
  await db.schema.dropTable('material_type').execute()
  await db.schema.dropTable('disposal_type').execute()
  await db.schema.dropTable('business').execute()
  await db.schema.dropTable('jurisdiction').execute()
  await db.schema.dropTable('business_group').execute()
  await db.schema.dropTable('county').execute()
}

export async function GET() {
  try {

    // TODO - either truncate or drop all tables before seeding? We're assuming this is the one and only time we put data into the database

    await dropAllTables()

    await createTables()
    await seedData()

    return Response.json({ message: 'Database seeded successfully' })
  } catch (error) {
    // TODO - roll back anything the database did
    // Turns out it's actually a significant refactor to incorporate transactions in order to perform a rollback, but something to consider for robustness (for now it seems sufficient to just drop everything/debug as we go)

    console.log("here")
    let definitely_error = ensureError(error)
    let message = definitely_error.message
    return Response.json( { message }, { status: 500 })

    // return Response.json( { message }, { status: 500 })
  }
}
