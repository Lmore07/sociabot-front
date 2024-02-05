import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponse } from '../../../shared-modules/interfaces/global.interface';
import { CourseStudentsResponse } from '../interfaces/courses-students.interface';
import {
  CoursesRequest,
  CoursesResponse,
} from './../interfaces/courses.interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private http: HttpClient) {}

  //FUNCTIONS
  getMyCoursesByTeacher(status: boolean) {
    console.log(status);
    return this.http.get<GeneralResponse<CoursesResponse[]>>(
      environment.apiUrl + '/courses/my-courses?status=' + status
    );
  }

  getStudentsByCourse(courseId: string, status: boolean) {
    return this.http.get<GeneralResponse<CourseStudentsResponse[]>>(
      environment.apiUrl +
        '/course-students/' +
        courseId +
        '/students?status=' +
        status
    );
  }

  addCourse(course: CoursesRequest) {
    return this.http.post<GeneralResponse>(
      environment.apiUrl + '/courses',
      course
    );
  }

  changeStatusCourse(courseId: string) {
    return this.http.patch<GeneralResponse>(
      environment.apiUrl + '/courses/status/' + courseId,
      null
    );
  }

  editCourse(courseId: string, course: CoursesRequest) {
    return this.http.put<GeneralResponse>(
      environment.apiUrl + '/courses/' + courseId,
      course
    );
  }
}
