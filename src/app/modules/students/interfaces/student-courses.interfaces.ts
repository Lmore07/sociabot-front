export interface GeneralCoursesResponse {
    statusCode: number;
    message: string;
    data: MyCoursesResponse[];
    error?: string;
  }

export interface MyCoursesResponse{
    id: string;
    course: Course;
}

interface Course{
    description: string;
    name: string;
    id: string;
    teacher: Teacher;
}

interface Teacher{
    firstName: string;
    lastName: string;
    id: string;
}