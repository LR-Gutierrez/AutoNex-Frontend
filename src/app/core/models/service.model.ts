export interface ServiceResponse {
  id: number;
  name: string;
  description?: string;
  defaultPrice: number;
  minKmInterval?: number;
  maxKmInterval?: number;
  recommendedMonths?: number;
  createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  defaultPrice: number;
  minKmInterval?: number;
  maxKmInterval?: number;
  recommendedMonths?: number;
}

export type UpdateServiceRequest = CreateServiceRequest;
