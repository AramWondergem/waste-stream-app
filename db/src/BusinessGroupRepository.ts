import { db } from './database'
import { BusinessGroup, NewBusinessGroup, BusinessGroupUpdate } from './types'

// Find a business group by its ID
export async function findBusinessGroupById(group_id: number) {
  return await db.selectFrom('business_group')
    .where('group_id', '=', group_id)
    .selectAll()
    .executeTakeFirst()
}

// Find business groups based on partial criteria
export async function findBusinessGroups(criteria: Partial<BusinessGroup>) {
  let query = db.selectFrom('business_group')

  if (criteria.group_id) {
    query = query.where('group_id', '=', criteria.group_id)
  }

  if (criteria.group_name) {
    query = query.where('group_name', '=', criteria.group_name)
  }

  return await query.selectAll().execute()
}

// Update a business group by its ID
export async function updateBusinessGroup(group_id: number, updateWith: BusinessGroupUpdate) {
  await db.updateTable('business_group').set(updateWith).where('group_id', '=', group_id).execute()
}

// Create a new business group entry
export async function createBusinessGroup(businessGroup: NewBusinessGroup) {
  return await db.insertInto('business_group')
    .values(businessGroup)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a business group by its ID
export async function deleteBusinessGroup(group_id: number) {
  return await db.deleteFrom('business_group').where('group_id', '=', group_id)
    .returningAll()
    .executeTakeFirst()
}
