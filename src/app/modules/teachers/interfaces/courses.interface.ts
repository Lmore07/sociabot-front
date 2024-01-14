export interface GeneralCoursesResponse {
  statusCode: number;
  message: string;
  data: CoursesResponse[];
  error?: string;
}

export interface CoursesResponse {
  name: string;
  description: string;
  code: string;
  id: string;
  status: boolean;
  createdAt: Date;
}

export interface CoursesRequest {
  name: string;
  description: string;
}
