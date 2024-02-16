import { Injectable } from '@angular/core';
import { GeneralResponse } from '../../../shared-modules/interfaces/global.interface';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StudentsByTeacherResponse } from '../interfaces/courses-students.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}

  getStudentsByTeacher(status: boolean) {
    return this.http.get<GeneralResponse<StudentsByTeacherResponse[]>>(
      `${environment.apiUrl}/course-students/students?status=${status}`
    );
  }

  getStudentsByCourse(courseId: string, status: boolean) {
    return this.http.get<GeneralResponse<StudentsByTeacherResponse[]>>(
      `${environment.apiUrl}/course-students/students?status=${status}?courseId=${courseId}`
    );
  }

  getAnswersByFormId(formId: string) {
    return this.http.get<GeneralResponse<any[]>>(
      `${environment.apiUrl}/forms/answers/${formId}`
    );
  }
}
