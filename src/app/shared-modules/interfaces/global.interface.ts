export interface GeneralResponse<T = undefined> {
  statusCode: number;
  message: string;
  data?: T | null;
  error?: string;
}
