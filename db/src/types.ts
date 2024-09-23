import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely'

export interface Database {
  jurisdiction: JurisdictionTable
  business: BusinessTable
  county: CountyTable
  business_group: BusinessGroupTable
  disposal_type: DisposalTypeTable
  material_type: MaterialTypeTable
  business_disposal_record: BusinessDisposalRecordTable
  group_disposal_record: GroupDisposalRecordTable
}


// ------------------ Jurisdiction Table ------------------

export interface JurisdictionTable {
  jurisdiction_id: Generated<number>;  // auto-incrementing integer
  county_id: number;                   // foreign key to county.county_id
  name: string;
  lon: number;                         // decimal(9, 6)
  lat: number;                         // decimal(8, 6)
}

export type Jurisdiction = Selectable<JurisdictionTable>
export type NewJurisdiction = Insertable<JurisdictionTable>
export type JurisdictionUpdate = Updateable<JurisdictionTable>


// ------------------ Business Table ------------------

export interface BusinessTable {
  business_id: Generated<number>;  // auto-incrementing integer
  business_group_id: number;     // foreign key to business_group.group_id
  jurisdiction_id: number;       // foreign key to jurisdiction.jurisdiction_id
  name: string;
  description: string;
  phone_number: string;
  lon: number;                         // decimal(9, 6)
  lat: number;                         // decimal(8, 6)
}

export type Business = Selectable<BusinessTable>
export type NewBusiness = Insertable<BusinessTable>
export type BusinessUpdate = Updateable<BusinessTable>


// ------------------ County Table ------------------

export interface CountyTable {
  fips_code: number;
  name: string;
  lon: number;                         // decimal(9, 6)
  lat: number;                         // decimal(8, 6)
}

export type County = Selectable<CountyTable>
export type NewCounty = Insertable<CountyTable>
export type CountyUpdate = Updateable<CountyTable>


// ------------------ Business Group Table ------------------

export interface BusinessGroupTable {
  group_id: Generated<number>;  // auto-incrementing integer
  group_name: string;
}

export type BusinessGroup = Selectable<BusinessGroupTable>
export type NewBusinessGroup = Insertable<BusinessGroupTable>
export type BusinessGroupUpdate = Updateable<BusinessGroupTable>


// ------------------ Disposal Type Table ------------------

export interface DisposalTypeTable {
  disposal_type_id: Generated<number>;  // auto-incrementing integer
  type_name: string;
}

export type DisposalType = Selectable<DisposalTypeTable>
export type NewDisposalType = Insertable<DisposalTypeTable>
export type DisposalTypeUpdate = Updateable<DisposalTypeTable>


// ------------------ Material Type Table ------------------

export interface MaterialTypeTable {
  material_type_id: Generated<number>;  // auto-incrementing integer
  material_category: string;
  material_type: string;
}

export type MaterialType = Selectable<MaterialTypeTable>
export type NewMaterialType = Insertable<MaterialTypeTable>
export type MaterialTypeUpdate = Updateable<MaterialTypeTable>


// ------------------ Business Disposal Record Table ------------------

export interface BusinessDisposalRecordTable {
  business_id: number;                 // foreign key to business.business_id
  material_id: number;                 // foreign key to material_type.material_type_id
  disposal_type_id: number;            // foreign key to disposal_type.disposal_type_id
  disposal_amount: number;             // decimal(8, 2)
}

export type BusinessDisposalRecord = Selectable<BusinessDisposalRecordTable>
export type NewBusinessDisposalRecord = Insertable<BusinessDisposalRecordTable>
export type BusinessDisposalRecordUpdate = Updateable<BusinessDisposalRecordTable>


// ------------------ Group Disposal Record Table ------------------

export interface GroupDisposalRecordTable {
  material_id: number;               // foreign key to material_type.material_type_id
  jurisdiction_id: number;           // foreign key to jurisdiction.jurisdiction_id
  business_group_id: number;         // foreign key to business_group.business_group_id
  disposal_type_id: number;          // foreign key to disposal_type.disposal_type_id
  disposal_amount: number;           // decimal(8, 2)
}

export type GroupDisposalRecord = Selectable<GroupDisposalRecordTable>
export type NewGroupDisposalRecord = Insertable<GroupDisposalRecordTable>
export type GroupDisposalRecordUpdate = Updateable<GroupDisposalRecordTable>
