import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralResponse } from '../../shared-modules/interfaces/global.interface';
import { ModuleRequest, ModuleResponse } from '../interfaces/modules.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  constructor(private http: HttpClient) {}

  getModulesByCourseId(courseId: string, status: boolean) {
    return this.http.get<GeneralResponse<ModuleResponse[]>>(
      `${environment.apiUrl}/modules/${courseId}?status=${status}`
    );
  }

  getAllModules(status: boolean) {
    return this.http.get<GeneralResponse<ModuleResponse[]>>(
      environment.apiUrl + '/modules?status=' + status
    );
  }

  createModule(module: ModuleRequest, courseId: string) {
    return this.http.post<GeneralResponse>(
      environment.apiUrl + '/modules?courseId=' + courseId,
      module
    );
  }

  updateModule(module: ModuleRequest, moduleId: string) {
    return this.http.put<GeneralResponse>(
      environment.apiUrl + '/modules/' + moduleId,
      module
    );
  }

  changeStatusModule(moduleId: string) {
    return this.http.patch<GeneralResponse>(
      environment.apiUrl + '/modules/' + moduleId + '/status',
      {}
    );
  }

  moveModuleToAnotherCourse(moduleId: string, courseId: string) {
    return this.http.patch<GeneralResponse>(
      environment.apiUrl + '/modules/' + moduleId + '/move',
      { courseId }
    );
  }
}
