import { UserRole } from "./user";

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignup {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
