import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../interfaces/login.interface';
import { Observable } from 'rxjs';
import {
  SignUpRequest,
  SignUpResponse,
} from '../interfaces/register.interface';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponse } from '../../../shared-modules/interfaces/global.interface';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  //Variables
  headers: any;

  constructor(private http: HttpClient) {}

  //FUNCTIONS
  login(loginData: LoginRequest): Observable<GeneralResponse<LoginResponse>> {
    return this.http.post<GeneralResponse<LoginResponse>>(
      environment.apiUrl + '/auth/login',
      null,
      {
        headers: { password: loginData.password, email: loginData.email },
      }
    );
  }

  signUp(
    signUpData: SignUpRequest
  ): Observable<GeneralResponse<SignUpResponse>> {
    return this.http.post<GeneralResponse<SignUpResponse>>(
      environment.apiUrl + '/users',
      signUpData
    );
  }
}
