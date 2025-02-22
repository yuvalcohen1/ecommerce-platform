export enum UserRole {
  Admin = "admin",
  User = "customer",
  Moderator = "vendor",
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  createdAt?: Date;
}
