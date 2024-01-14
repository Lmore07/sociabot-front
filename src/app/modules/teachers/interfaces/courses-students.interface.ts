export interface GeneralCourseStudentsResponse {
  statusCode: number;
  message: string;
  data: CourseStudentsResponse[];
  error?: string;
}

export interface CourseStudentsResponse {
  student: StudentResponse;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: Date;
}
