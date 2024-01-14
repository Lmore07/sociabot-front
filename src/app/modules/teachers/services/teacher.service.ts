import { GeneralCoursesResponse } from './../interfaces/courses.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private http: HttpClient) {}

  //FUNCTIONS
  getMyCoursesByTeacher(status: boolean) {
    console.log(status);
    return this.http.get<GeneralCoursesResponse>(
      environment.apiUrl + '/courses/my-courses?status=' + status,
    );
  }
}
