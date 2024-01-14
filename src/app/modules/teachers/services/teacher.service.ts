import {
  CoursesRequest,
  GeneralCoursesResponse,
} from './../interfaces/courses.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { GeneralCourseStudentsResponse } from '../interfaces/courses-students.interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private http: HttpClient) {}

  //FUNCTIONS
  getMyCoursesByTeacher(status: boolean) {
    console.log(status);
    return this.http.get<GeneralCoursesResponse>(
      environment.apiUrl + '/courses/my-courses?status=' + status
    );
  }

  getStudentsByCourse(courseId: string, status: boolean) {
    return this.http.get<GeneralCourseStudentsResponse>(
      environment.apiUrl +
        '/course-students/' +
        courseId +
        '/students?status=' +
        status
    );
  }

  addCourse(course: CoursesRequest) {
    return this.http.post<GeneralCourseStudentsResponse>(
      environment.apiUrl + '/courses',
      course
    );
  }

  changeStatusCourse(courseId: string) {
    return this.http.patch<GeneralCourseStudentsResponse>(
      environment.apiUrl + '/courses/status/' + courseId,
      null
    );
  }

  editCourse(courseId: string, course: CoursesRequest) {
    return this.http.put<GeneralCourseStudentsResponse>(
      environment.apiUrl + '/courses/' + courseId,
      course
    );
  }
}
