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

