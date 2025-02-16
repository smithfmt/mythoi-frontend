export type UserType = {
  id: number;
  email: string;
  name?: string;
}

export type ApiResponse = {
  message: string;
  data?: unknown;
  status: number;
};
