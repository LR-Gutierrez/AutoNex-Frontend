export enum MovementType {
  In = 'In',
  Out = 'Out',
}

export interface InventoryMovementResponse {
  id: number;
  consumableId?: number;
  consumableName?: string;
  toolId?: number;
  toolName?: string;
  movementType: MovementType;
  quantity: number;
  reference: string;
  referenceId: number;
  notes?: string;
  createdAt: string;
}
