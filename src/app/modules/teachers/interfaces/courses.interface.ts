export interface CoursesResponse {
  name: string;
  description: string;
  code: string;
  id: string;
  status: boolean;
  created_at: Date;
}

export interface CoursesRequest {
  name: string;
  description: string;
}

