export interface MessageTemplateResponse {
  id: number;
  key: string;
  template: string;
  description?: string;
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
