export interface MileageAlertResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  lastRecordedKm: number;
  estimatedWeeklyKm: number;
  nextAlertKm: number;
  remainingKm: number;
  isDue: boolean;
  lastAlertDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateMileageAlertRequest {
  vehicleId: number;
  estimatedWeeklyKm: number;
}

export interface UpdateMileageAlertRequest {
  estimatedWeeklyKm: number;
}
