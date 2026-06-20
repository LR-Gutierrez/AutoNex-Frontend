export interface ServiceResponse {
  id: number;
  name: string;
  description?: string;
  defaultPrice: number;
  minKmInterval?: number;
  maxKmInterval?: number;
  minMonth?: number;
  maxMonth?: number;
  createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  defaultPrice: number;
  minKmInterval?: number;
  maxKmInterval?: number;
  minMonth?: number;
  maxMonth?: number;
}

export type UpdateServiceRequest = CreateServiceRequest;
