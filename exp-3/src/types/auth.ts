export type UserRole = "admin" | "editor" | "viewer";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface DemoAccount {
  username: string;
  password: string;
  user: AuthUser;
}
