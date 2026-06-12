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
