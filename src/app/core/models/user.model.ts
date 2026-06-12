export enum UserRole {
  Admin = 'Admin',
  Mechanic = 'Mechanic',
  Receptionist = 'Receptionist',
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
}
