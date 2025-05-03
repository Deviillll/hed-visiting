import { Role } from "./role";

export interface User {
  email: string;
  password: string;
  role: Role;
  name: string;
}

export const predefinedUsers: User[] = [
  {
    email: "superadministrator@example.com",
    password: "password",
    role: "superadministrator",
    name: "Super Admin"
  },
  {
    email: "administrator@example.com",
    password: "password",
    role: "administrator",
    name: "Admin"
  },
  {
    email: "principal@example.com",
    password: "password",
    role: "principal",
    name: "Principal"
  },
  {
    email: "employee@example.com",
    password: "password",
    role: "employee",
    name: "Employee"
  }
]; 