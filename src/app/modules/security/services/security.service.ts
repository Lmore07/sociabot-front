import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  GeneralLoginResponse,
  LoginRequest,
} from '../interfaces/login.interface';
import { Observable } from 'rxjs';

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
}
