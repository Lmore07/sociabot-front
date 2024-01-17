import { UserType } from "../enums/user-type.enum";

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
