export interface MileageAlertResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  serviceId: number;
  serviceName: string;
  currentKm: number;
  estimatedWeeklyKm: number;
  nextAlertKm: number;
  remainingKm: number | null;
  warningKm: number | null;
  isDue: boolean;
  lastAlertDate: string | null;
  nextAlertDate: string | null;
  serviceMinKmInterval: number | null;
  serviceMaxKmInterval: number | null;
  serviceMinMonth: number | null;
  serviceMaxMonth: number | null;
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

export interface AlertPreview {
  alertId: number;
  serviceName: string;
  message: string;
}
