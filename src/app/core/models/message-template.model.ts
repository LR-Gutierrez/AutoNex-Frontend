export interface MessageTemplateResponse {
  id: number;
  key: string;
  template: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageTemplateRequest {
  key: string;
  template: string;
  description?: string;
}

export interface UpdateMessageTemplateRequest {
  template: string;
  description?: string;
}
