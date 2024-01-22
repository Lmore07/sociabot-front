import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralCoursesResponse } from '../interfaces/student-courses.interfaces';
import { environment } from '../../../../environments/environment';

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

  getModulesByCourse(courseId: string) {
    return this.http.get(
      environment.apiUrl + `/modules/${courseId}?status=true`
    );
  }

  getChatsByModule(moduleId: string) {
    return this.http.get(
      environment.apiUrl + `/chats/get-chats/${moduleId}`
    );
  }

  newChat(moduleId: string) {
    return this.http.post(
      environment.apiUrl + `/chats/create-chat`,
      { moduleId }
    );
  }

  getObservations(chatId: string) {
    return this.http.get(
      environment.apiUrl + `/chats/get-observations/${chatId}`
    );
  }
}
