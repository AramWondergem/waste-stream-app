import { db } from './database'
import { BusinessDisposalRecord, NewBusinessDisposalRecord, BusinessDisposalRecordUpdate } from './types'

// Find a business disposal record by its composite primary key
export async function findBusinessDisposalRecordById(business_id: number, material_id: number, disposal_type_id: number) {
  return await db.selectFrom('business_disposal_record')
    .where('business_id', '=', business_id)
    .where('material_id', '=', material_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .selectAll()
    .executeTakeFirst()
}

// Find business disposal records based on partial criteria
export async function findBusinessDisposalRecords(criteria: Partial<BusinessDisposalRecord>) {
  let query = db.selectFrom('business_disposal_record')

  if (criteria.business_id !== undefined) {
    query = query.where('business_id', '=', criteria.business_id)
  }

  if (criteria.material_id !== undefined) {
    query = query.where('material_id', '=', criteria.material_id)
  }

  if (criteria.disposal_type_id !== undefined) {
    query = query.where('disposal_type_id', '=', criteria.disposal_type_id)
  }

  if (criteria.disposal_amount !== undefined) {
    query = query.where('disposal_amount', '=', criteria.disposal_amount)
  }

  return await query.selectAll().execute()
}

// Update a business disposal record by its composite primary key
export async function updateBusinessDisposalRecord(business_id: number, material_id: number, disposal_type_id: number, updateWith: BusinessDisposalRecordUpdate) {
  await db.updateTable('business_disposal_record')
    .set(updateWith)
    .where('business_id', '=', business_id)
    .where('material_id', '=', material_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .execute()
}

// Create a new business disposal record entry
export async function createBusinessDisposalRecord(businessDisposalRecord: NewBusinessDisposalRecord) {
  return await db.insertInto('business_disposal_record')
    .values(businessDisposalRecord)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a business disposal record by its composite primary key
export async function deleteBusinessDisposalRecord(business_id: number, material_id: number, disposal_type_id: number) {
  return await db.deleteFrom('business_disposal_record')
    .where('business_id', '=', business_id)
    .where('material_id', '=', material_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .returningAll()
    .executeTakeFirst()
}
