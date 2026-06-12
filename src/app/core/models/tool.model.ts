export enum ToolCategory {
  Jack = 'Jack',
  Wrench = 'Wrench',
  Ratchet = 'Ratchet',
  Screwdriver = 'Screwdriver',
  Hammer = 'Hammer',
  Other = 'Other',
}

export enum ToolStatus {
  Available = 'Available',
  Damaged = 'Damaged',
  Lost = 'Lost',
}

export interface ToolResponse {
  id: number;
  name: string;
  category: ToolCategory;
  quantity: number;
  status: ToolStatus;
  purchaseDate?: string;
  createdAt: string;
}

export interface CreateToolRequest {
  name: string;
  category: ToolCategory;
  quantity: number;
  status: ToolStatus;
  purchaseDate?: string;
}

export type UpdateToolRequest = CreateToolRequest;
