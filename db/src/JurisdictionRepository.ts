import { db } from './database'
import { JurisdictionUpdate, Jurisdiction, NewJurisdiction } from './types'

export async function findJurisdictionById(jurisdiction_id: number) {
  return await db.selectFrom('jurisdiction')
    .where('jurisdiction_id', '=', jurisdiction_id)
    .selectAll()
    .executeTakeFirst()
}

export async function findJurisdictions(criteria: Partial<Jurisdiction>) {
  let query = db.selectFrom('jurisdiction')

  if (criteria.jurisdiction_id) {
    query = query.where('jurisdiction_id', '=', criteria.jurisdiction_id)
  }

  if (criteria.county_id) {
    query = query.where('county_id', '=', criteria.county_id)
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

export async function updateJurisdiction(jurisdiction_id: number, updateWith: JurisdictionUpdate) {
  await db.updateTable('jurisdiction').set(updateWith).where('jurisdiction_id', '=', jurisdiction_id).execute()
}

export async function createJurisdiction(jurisdiction: NewJurisdiction) {
  return await db.insertInto('jurisdiction')
    .values(jurisdiction)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function deleteJurisdiction(jurisdiction_id: number) {
  return await db.deleteFrom('jurisdiction').where('jurisdiction_id', '=', jurisdiction_id)
    .returningAll()
    .executeTakeFirst()
}