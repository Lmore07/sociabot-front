import { UserType } from "../enums/user-type.enum";

export interface GeneralLoginResponse {
  statusCode: number;
  message: string;
  data: LoginResponse;
  error?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenDecode {
  email: string;
  role: UserType;
}
