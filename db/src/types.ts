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

export interface JurisdictionTable {
  jurisdiction_id: Generated<number>;  // auto-incrementing integer
  county_id: number;                   // foreign key to county.county_id
  name: string;
  lon: number;                         // decimal(9, 6)
  lat: number;                         // decimal(8, 6)
}

export type Jurisdiction = Selectable<JursidictionTable>
export type NewJurisdiction = Insertable<JurisdictionTable>
export type JurisdictionUpdate = Updateable<JurisdictionTable>


export interface BusinessTable {
  business_id: Generated<number>;  // auto-incrementing integer
  business_group_id: number;     // foreign key to business_group.business_group_id
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