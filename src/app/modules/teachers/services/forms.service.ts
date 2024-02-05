import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsRequest, FormsResponse } from '../interfaces/forms.interface';
import { GeneralResponse } from '../../../shared-modules/interfaces/global.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(private http: HttpClient) {}

  createForm(formData: FormsRequest, moduleId: string) {
    return this.http.post<GeneralResponse>(
      environment.apiUrl + '/forms?moduleId=' + moduleId,
      formData
    );
  }

  getMyFormsByModule(moduleId: string, status: boolean) {
    console.log(status);
    return this.http.get<GeneralResponse<FormsResponse[]>>(
      `${environment.apiUrl}/forms/${moduleId}?status=${status}`
    );
  }

  getMyForms(status: boolean) {
    console.log(status);
    return this.http.get<GeneralResponse<FormsResponse[]>>(
      `${environment.apiUrl}/forms?status=${status}`
    );
  }

  updateForm(formData: FormsRequest, formId: string) {
    return this.http.put<GeneralResponse>(
      environment.apiUrl + '/forms/' + formId,
      formData
    );
  }

  changeStatusForm(formId: string) {
    return this.http.patch<GeneralResponse>(
      environment.apiUrl + '/forms/' + formId + '/status',
      {}
    );
  }
}