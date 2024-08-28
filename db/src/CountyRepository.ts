import { db } from './database'
import { CountyUpdate, County, NewCounty } from './types'

// Find a county by its FIPS code
export async function findCountyByFipsCode(fips_code: number) {
  return await db.selectFrom('county')
    .where('fips_code', '=', fips_code)
    .selectAll()
    .executeTakeFirst()
}

// Find counties based on partial criteria
export async function findCounties(criteria: Partial<County>) {
  let query = db.selectFrom('county')

  if (criteria.fips_code) {
    query = query.where('fips_code', '=', criteria.fips_code)
  }

  if (criteria.name) {
    query = query.where('name', '=', criteria.name)
  }

  if (criteria.lon) {
    query = query.where('lon', '=', criteria.lon)
  }

  if (criteria.lat) {
    query = query.where('lat', '=', criteria.lat)
  }

  return await query.selectAll().execute()
}

// Update a county by its FIPS code
export async function updateCounty(fips_code: number, updateWith: CountyUpdate) {
  await db.updateTable('county')
    .set(updateWith)
    .where('fips_code', '=', fips_code)
    .execute()
}

// Create a new county entry
export async function createCounty(county: NewCounty) {
  return await db.insertInto('county')
    .values(county)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a county by its FIPS code
export async function deleteCounty(fips_code: number) {
  return await db.deleteFrom('county')
    .where('fips_code', '=', fips_code)
    .returningAll()
    .executeTakeFirst()
}
