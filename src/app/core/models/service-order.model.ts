export enum ServiceOrderStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
}

export interface ServiceOrderResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  clientId: number;
  clientName: string;
  userId: number;
  userName: string;
  currentKm: number;
  estimatedDailyKm?: number;
  daysPerWeek?: number;
  date: string;
  status: ServiceOrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  items: ServiceOrderItemResponse[];
}

export interface ServiceOrderItemResponse {
  id: number;
  type: 'Service' | 'Consumable';
  serviceId?: number;
  serviceName?: string;
  consumableId?: number;
  consumableName?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateServiceOrderRequest {
  vehicleId: number;
  clientId: number;
  currentKm: number;
  estimatedDailyKm?: number;
  daysPerWeek?: number;
  notes?: string;
  items: CreateServiceOrderItemRequest[];
}

export interface CreateServiceOrderItemRequest {
  type: 'Service' | 'Consumable';
  serviceId?: number;
  consumableId?: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateServiceOrderStatusRequest {
  status: ServiceOrderStatus;
}

export interface PayServiceOrderRequest {
  paymentMethod: 'pago-movil' | 'transferencia' | 'efectivo-dolares' | 'efectivo-bolivares';
  operationNumber?: string;
  operationDate?: string;
  amountBs?: number;
}
