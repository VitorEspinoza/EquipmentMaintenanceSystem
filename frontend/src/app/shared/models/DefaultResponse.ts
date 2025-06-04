export interface DefaultResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[];
}
