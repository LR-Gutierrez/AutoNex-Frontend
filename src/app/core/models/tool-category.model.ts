export interface ToolCategoryResponse {
  id: number;
  name: string;
}

export interface CreateToolCategoryRequest {
  name: string;
}

export type UpdateToolCategoryRequest = CreateToolCategoryRequest;
