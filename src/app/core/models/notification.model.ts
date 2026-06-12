export enum NotificationType {
  WhatsApp = 'WhatsApp',
  Sms = 'Sms',
  Email = 'Email',
}

export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed',
}

export interface NotificationResponse {
  id: number;
  clientId: number;
  clientName: string;
  vehicleId?: number;
  vehicleInfo?: string;
  type: NotificationType;
  recipient: string;
  message: string;
  sentAt?: string;
  status: NotificationStatus;
  createdAt: string;
}
