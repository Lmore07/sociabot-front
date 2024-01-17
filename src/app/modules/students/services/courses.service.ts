import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralCoursesResponse } from '../interfaces/student-courses.interfaces';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  getMyCoursesByStudent(status: boolean) {
    return this.http.get<GeneralCoursesResponse>(
      environment.apiUrl + '/course-students/my-courses?status=' + status,
    );
  }

  joinCourse(code: string) {
    return this.http.post(
      environment.apiUrl + '/course-students/join',
      { courseCode: code }
    );
  }
}