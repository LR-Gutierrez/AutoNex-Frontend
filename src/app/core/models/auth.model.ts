import { UserRole } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}
