export interface CourseStudentsResponse {
  student: StudentResponse;
  id: string;
  createdAt: Date;
  updateAt: Date;
}

export interface StudentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: Date;
}
