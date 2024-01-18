import { CoursesResponse } from "./courses.interface";

export interface ModuleResponse {
  id: number;
  name: string;
  goals: string;
  isPublic: boolean;
  status: boolean;
  createdAt: Date;
  updateAt: Date;
  course_id: string;
  course: CoursesResponse;
}

export interface ModuleRequest{
  name: string;
  goals: string;
  isPublic: boolean;
}