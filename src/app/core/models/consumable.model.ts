export enum ConsumableCategory {
  Oil = 'Oil',
  SparkPlug = 'SparkPlug',
  Coolant = 'Coolant',
  Grease = 'Grease',
  BrakeFluid = 'BrakeFluid',
  Other = 'Other',
}

export interface ConsumableResponse {
  id: number;
  name: string;
  category: ConsumableCategory;
  stockQuantity: number;
  minStock: number;
  unitPrice: number;
  supplierId?: number;
  supplierName?: string;
  createdAt: string;
}

export interface CreateConsumableRequest {
  name: string;
  category: ConsumableCategory;
  stockQuantity: number;
  minStock: number;
  unitPrice: number;
  supplierId?: number;
}

export type UpdateConsumableRequest = CreateConsumableRequest;
