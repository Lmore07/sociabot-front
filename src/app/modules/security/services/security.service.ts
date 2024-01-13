import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  GeneralLoginResponse,
  LoginRequest,
} from '../interfaces/login.interface';
import { Observable } from 'rxjs';
import {
  GeneralSignUpResponse,
  SignUpRequest,
} from '../interfaces/register.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  //Variables
  headers: any;

  constructor(private http: HttpClient) {}

  //FUNCTIONS
  login(loginData: LoginRequest): Observable<GeneralLoginResponse> {
    return this.http.post<GeneralLoginResponse>(
      environment.apiUrl + '/auth/login',
      null,
      {
        headers: { password: loginData.password, email: loginData.email },
      }
    );
  }

  signUp(signUpData: SignUpRequest): Observable<GeneralSignUpResponse> {
    return this.http.post<GeneralSignUpResponse>(
      environment.apiUrl + '/users',
      signUpData
    );
  }
}
