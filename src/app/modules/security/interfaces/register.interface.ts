import { UserType } from '../enums/user-type.enum';

export interface SignUpResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  createdAt: Date;
  updateAt: Date;
  role: UserType;
  status: boolean;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  role: UserType;
}
