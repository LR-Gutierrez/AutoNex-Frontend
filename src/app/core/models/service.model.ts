export interface ServiceResponse {
  id: number;
  name: string;
  description?: string;
  defaultPrice: number;
  recommendedKmInterval?: number;
  createdAt: string;
  variants?: ServiceVariantResponse[];
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  defaultPrice: number;
  recommendedKmInterval?: number;
}

export type UpdateServiceRequest = CreateServiceRequest;

export interface ServiceVariantResponse {
  id: number;
  serviceId: number;
  name: string;
  description?: string;
  minKmInterval?: number;
  maxKmInterval?: number;
  recommendedMonths?: number;
  isActive: boolean;
}

export interface CreateServiceVariantRequest {
  name: string;
  description?: string;
  minKmInterval?: number;
  maxKmInterval?: number;
  recommendedMonths?: number;
}

export type UpdateServiceVariantRequest = CreateServiceVariantRequest;
