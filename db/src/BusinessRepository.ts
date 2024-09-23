import { db } from './database'
import { BusinessUpdate, Business, NewBusiness } from './types'

// Find a business by its ID
export async function findBusinessById(business_id: number) {
  return await db.selectFrom('business')
    .where('business_id', '=', business_id)
    .selectAll()
    .executeTakeFirst()
}

// Find businesses based on partial criteria
export async function findBusinesss(criteria: Partial<Business>) {
  let query = db.selectFrom('business')

  if (criteria.business_id) {
    query = query.where('business_id', '=', criteria.business_id)
  }

  if (criteria.business_group_id) {
    query = query.where('business_group_id', '=', criteria.business_group_id)
  }

  if (criteria.jurisdiction_id) {
    query = query.where('jurisdiction_id', '=', criteria.jurisdiction_id)
  }

  if (criteria.name) {
    query = query.where('name', '=', criteria.name)
  }

  if (criteria.description) {
    query = query.where('description', '=', criteria.description)
  }

  if (criteria.phone_number) {
    query = query.where('phone_number', '=', criteria.phone_number)
  }

  if (criteria.lon) {
    query = query.where('lon', '=', criteria.lon)
  }

  if (criteria.lat) {
    query = query.where('lat', '=', criteria.lat)
  }

  return await query.selectAll().execute()
}

// Update a business by its ID
export async function updateBusiness(business_id: number, updateWith: BusinessUpdate) {
  await db.updateTable('business').set(updateWith).where('business_id', '=', business_id).execute()
}

// Create a new business entry
export async function createBusiness(business: NewBusiness) {
  return await db.insertInto('business')
    .values(business)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a business by its ID
export async function deleteBusiness(business_id: number) {
  return await db.deleteFrom('business').where('business_id', '=', business_id)
    .returningAll()
    .executeTakeFirst()
}