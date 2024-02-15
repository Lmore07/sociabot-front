import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  getFormById(formId: string) {
    return this.http.get(
      environment.apiUrl + `/forms/getById/${formId}`
    );
  }

  getForms() {
    return this.http.get(
      environment.apiUrl + '/forms'
    );
  }

}
