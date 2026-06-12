import { VehicleBriefResponse } from './vehicle.model';

export interface ClientResponse {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  vehicles?: VehicleBriefResponse[];
}

export interface CreateClientRequest {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}

export type UpdateClientRequest = CreateClientRequest;
