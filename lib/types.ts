
// User types
export type UserRole = "superadmin" | "admin" | "principal" | "employee";

export type UserStatus = "active" | "inactive";

export interface User {
	id?: string;
	name: string;
	email?: string;
	role: UserRole;
	avatar?: string;
}
// craete a type for role that is a object with key of role and value of UserRole
export type RoleObject = {
	role: UserRole;
};

// Authentication types
export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

// In a real app, you would define more types related to your domain
