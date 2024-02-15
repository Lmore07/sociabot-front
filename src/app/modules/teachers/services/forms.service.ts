import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GeneralResponse } from '../../../shared-modules/interfaces/global.interface';
import { FormsRequest, FormsResponse } from '../interfaces/forms.interface';

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
    return this.http.get<GeneralResponse<FormsResponse[]>>(
      `${environment.apiUrl}/forms/?status=${status}?moduleId=${moduleId}`
    );
  }

  getMyForms(status: boolean) {
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
