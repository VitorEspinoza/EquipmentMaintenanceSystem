export interface ApiResponse<T> {
  isSuccess: boolean;
  errors: string[];
  data: T;
}
