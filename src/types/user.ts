export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "job_seeker" | "employer" | "admin";
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ICreateUserResponse {
  success: boolean;
  data?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  error?: string;
}
