import { db } from './database'
import { MaterialType, NewMaterialType, MaterialTypeUpdate } from './types'

// Find a material type by its ID
export async function findMaterialTypeById(material_type_id: number) {
  return await db.selectFrom('material_type')
    .where('material_type_id', '=', material_type_id)
    .selectAll()
    .executeTakeFirst()
}

// Find material types based on partial criteria
export async function findMaterialTypes(criteria: Partial<MaterialType>) {
  let query = db.selectFrom('material_type')

  if (criteria.material_type_id) {
    query = query.where('material_type_id', '=', criteria.material_type_id)
  }

  if (criteria.material_category) {
    query = query.where('material_category', '=', criteria.material_category)
  }

  if (criteria.material_type) {
    query = query.where('material_type', '=', criteria.material_type)
  }

  return await query.selectAll().execute()
}

// Update a material type by its ID
export async function updateMaterialType(material_type_id: number, updateWith: MaterialTypeUpdate) {
  await db.updateTable('material_type').set(updateWith).where('material_type_id', '=', material_type_id).execute()
}

// Create a new material type entry
export async function createMaterialType(materialType: NewMaterialType) {
  return await db.insertInto('material_type')
    .values(materialType)
    .returningAll()
    .executeTakeFirstOrThrow()
}

// Delete a material type by its ID
export async function deleteMaterialType(material_type_id: number) {
  return await db.deleteFrom('material_type').where('material_type_id', '=', material_type_id)
    .returningAll()
    .executeTakeFirst()
}
