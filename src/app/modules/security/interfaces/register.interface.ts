import { UserType } from '../enums/user-type.enum';

export interface SignUpResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  birth_date: Date;
  created_at: Date;
  updateAt: Date;
  role: UserType;
  status: boolean;
}

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  birth_date: Date;
  role: UserType;
}
