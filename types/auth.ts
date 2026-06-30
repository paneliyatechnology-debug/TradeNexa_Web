export type UserRole = "seller" | "buyer" | "both";

export interface User {
  id: string;
  name: string;
  company: string;
  email: string;
  address: string;
  city: string;
  state: string;
  role: UserRole;
  phone: string;
  country_code: string;
}

export interface SendOtpRequest {
  phone: string;
  country_code: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  country_code: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  is_registered: boolean;
}

export interface RegisterRequest {
  name: string;
  company: string;
  email: string;
  address: string;
  city: string;
  state: string;
  role: UserRole;
  phone: string;
  country_code: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
