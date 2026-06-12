export interface SupplierResponse {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export type UpdateSupplierRequest = CreateSupplierRequest;
