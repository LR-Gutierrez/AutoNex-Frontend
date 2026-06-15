export enum ToolStatus {
  Available = 'Available',
  Damaged = 'Damaged',
  Lost = 'Lost',
}

export interface ToolResponse {
  id: number;
  name: string;
  toolCategoryId: number;
  toolCategoryName?: string;
  quantity: number;
  status: ToolStatus;
  purchaseDate?: string;
  createdAt: string;
}

export interface CreateToolRequest {
  name: string;
  toolCategoryId: number;
  quantity: number;
  status: ToolStatus;
  purchaseDate?: string;
}

export type UpdateToolRequest = CreateToolRequest;
