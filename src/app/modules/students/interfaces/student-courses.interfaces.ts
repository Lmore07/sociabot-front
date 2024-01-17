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
    first_name: string;
    last_name: string;
    id: string;
}