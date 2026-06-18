export interface ServiceOrderBriefResponse {
  id: number;
  vehicleInfo: string;
  clientName: string;
  date: string;
  status: string;
  totalAmount: number;
}

export interface VehicleBriefResponse {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface VehicleResponse {
  id: number;
  clientId: number;
  clientName: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  createdAt: string;
  serviceOrders: ServiceOrderBriefResponse[];
}

export interface CreateVehicleRequest {
  clientId: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
}

export interface UpdateVehicleRequest {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
}
