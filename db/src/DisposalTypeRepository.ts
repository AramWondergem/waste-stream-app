import { db } from './database'
import { DisposalType, NewDisposalType, DisposalTypeUpdate } from './types'

// Find a disposal type by its ID
export async function findDisposalTypeById(disposal_type_id: number) {
  return await db.selectFrom('disposal_type')
    .where('disposal_type_id', '=', disposal_type_id)
    .selectAll()
    .executeTakeFirst()
}

// Find disposal types based on partial criteria
export async function findDisposalTypes(criteria: Partial<DisposalType>) {
  let query = db.selectFrom('disposal_type')

  if (criteria.disposal_type_id) {
    query = query.where('disposal_type_id', '=', criteria.disposal_type_id)
  }

  if (criteria.type_name) {
    query = query.where('type_name', '=', criteria.type_name)
  }

  return await query.selectAll().execute()
}

// Update a disposal type by its ID
export async function updateDisposalType(disposal_type_id: number, updateWith: DisposalTypeUpdate) {
  await db.updateTable('disposal_type').set(updateWith).where('disposal_type_id', '=', disposal_type_id).execute()
}

// Create a new disposal type entry
export async function createDisposalType(disposalType: NewDisposalType) {
  return await db.insertInto('disposal_type')
    .values(disposalType)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a disposal type by its ID
export async function deleteDisposalType(disposal_type_id: number) {
  return await db.deleteFrom('disposal_type').where('disposal_type_id', '=', disposal_type_id)
    .returningAll()
    .executeTakeFirst()
}
