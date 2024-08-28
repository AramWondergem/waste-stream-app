import { db } from './database'
import { GroupDisposalRecord, NewGroupDisposalRecord, GroupDisposalRecordUpdate } from './types'

// Find a group disposal record by its composite primary key
export async function findGroupDisposalRecordById(material_id: number, jurisdiction_id: number, business_group_id: number, disposal_type_id: number) {
  return await db.selectFrom('group_disposal_record')
    .where('material_id', '=', material_id)
    .where('jurisdiction_id', '=', jurisdiction_id)
    .where('business_group_id', '=', business_group_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .selectAll()
    .executeTakeFirst()
}

// Find group disposal records based on partial criteria
export async function findGroupDisposalRecords(criteria: Partial<GroupDisposalRecord>) {
  let query = db.selectFrom('group_disposal_record')

  if (criteria.material_id !== undefined) {
    query = query.where('material_id', '=', criteria.material_id)
  }

  if (criteria.jurisdiction_id !== undefined) {
    query = query.where('jurisdiction_id', '=', criteria.jurisdiction_id)
  }

  if (criteria.business_group_id !== undefined) {
    query = query.where('business_group_id', '=', criteria.business_group_id)
  }

  if (criteria.disposal_type_id !== undefined) {
    query = query.where('disposal_type_id', '=', criteria.disposal_type_id)
  }

  if (criteria.disposal_amount !== undefined) {
    query = query.where('disposal_amount', '=', criteria.disposal_amount)
  }

  return await query.selectAll().execute()
}

// Update a group disposal record by its composite primary key
export async function updateGroupDisposalRecord(
  material_id: number,
  jurisdiction_id: number,
  business_group_id: number,
  disposal_type_id: number,
  updateWith: GroupDisposalRecordUpdate
) {
  await db.updateTable('group_disposal_record')
    .set(updateWith)
    .where('material_id', '=', material_id)
    .where('jurisdiction_id', '=', jurisdiction_id)
    .where('business_group_id', '=', business_group_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .execute()
}

// Create a new group disposal record entry
export async function createGroupDisposalRecord(groupDisposalRecord: NewGroupDisposalRecord) {
  return await db.insertInto('group_disposal_record')
    .values(groupDisposalRecord)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a group disposal record by its composite primary key
export async function deleteGroupDisposalRecord(
  material_id: number,
  jurisdiction_id: number,
  business_group_id: number,
  disposal_type_id: number
) {
  return await db.deleteFrom('group_disposal_record')
    .where('material_id', '=', material_id)
    .where('jurisdiction_id', '=', jurisdiction_id)
    .where('business_group_id', '=', business_group_id)
    .where('disposal_type_id', '=', disposal_type_id)
    .returningAll()
    .executeTakeFirst()
}
