export interface CourseStudentsResponse {
  student: StudentResponse;
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  birth_date: Date;
}
