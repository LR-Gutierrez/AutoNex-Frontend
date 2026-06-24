export interface WorkshopInfoResponse {
  id: number;
  businessName: string;
  rif?: string;
  address?: string;
  city?: string;
  mapsUrl?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  updatedAt: string;
}

export interface UpdateWorkshopInfoRequest {
  businessName: string;
  rif?: string;
  address?: string;
  city?: string;
  mapsUrl?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
}
