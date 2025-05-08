import { UserRole } from "@/lib/types";

export interface BaseUser {
	id: string;
	name: string;
	email: string;
	password: string;
	role: UserRole;
	avatar: string;
	status: "active" | "inactive";
	createdAt: string;
	updatedAt: string;
}

export interface Employee extends BaseUser {
	role: "employee";
	department: string;
	position: string;
	interRate: number;
	bsRate: number;
	lastRateUpdate: string;
	principalId: string;
}

export interface Principal extends BaseUser {
	role: "principal";
	department: string;
	employees: string[]; // Array of employee IDs
}

export interface Admin extends BaseUser {
	role: "admin";
	managedDepartments: string[];
}

export interface SuperAdmin extends BaseUser {
	role: "superadmin";
}

export type User = Employee | Principal | Admin | SuperAdmin;

export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	department?: string;
	position?: string;
	interRate?: number;
	bsRate?: number;
	principalId?: string;
	managedDepartments?: string[];
}

export interface UpdateUserDTO {
	name?: string;
	email?: string;
	password?: string;
	status?: "active" | "inactive";
	department?: string;
	position?: string;
	interRate?: number;
	bsRate?: number;
	lastRateUpdate?: string;
	principalId?: string;
	managedDepartments?: string[];
}

export interface UserFilters {
	role?: UserRole;
	status?: "active" | "inactive";
	department?: string;
	principalId?: string;
}

export interface UserQuery {
	search?: string;
	filters?: UserFilters;
	page?: number;
	limit?: number;
	sortBy?: keyof User;
	sortOrder?: "asc" | "desc";
}
