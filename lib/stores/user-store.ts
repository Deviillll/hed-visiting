import {
	CreateUserDTO,
	UpdateUserDTO,
	User,
	UserQuery,
	UserRole,
} from "@/lib/models/user";
import { create } from "zustand";

interface UserState {
	users: User[];
	addUser: (user: CreateUserDTO) => void;
	updateUser: (id: string, user: UpdateUserDTO) => void;
	deleteUser: (id: string) => void;
	getUsersByRole: (role: UserRole) => User[];
	getUsersByQuery: (query: UserQuery) => User[];
	getUserById: (id: string) => User | undefined;
	getEmployeesByPrincipal: (principalId: string) => User[];
}

// Initial users data
const initialUsers: User[] = [
	{
		id: "1",
		email: "superadmin@example.com",
		password: "password",
		name: "Super Admin",
		role: "superadmin",
		avatar:
			"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
		status: "active",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "2",
		email: "admin@example.com",
		password: "password",
		name: "Admin User",
		role: "admin",
		avatar:
			"https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100",
		status: "active",
		managedDepartments: ["Engineering", "Marketing"],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "3",
		email: "principal@example.com",
		password: "password",
		name: "Principal User",
		role: "principal",
		avatar:
			"https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
		status: "active",
		department: "Engineering",
		employees: ["4", "5"],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: "4",
		email: "employee@example.com",
		password: "password",
		name: "Employee User",
		role: "employee",
		avatar:
			"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
		status: "active",
		department: "Engineering",
		position: "Software Engineer",
		interRate: 15,
		bsRate: 20,
		lastRateUpdate: new Date().toISOString(),
		principalId: "3",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export const useUserStore = create<UserState>((set, get) => ({
	users: initialUsers,
	addUser: (userData) => {
		const newUser: User = {
			...userData,
			id: (get().users.length + 1).toString(),
			status: "active",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			avatar:
				"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
		} as User;

		set((state) => ({
			users: [...state.users, newUser],
		}));
	},
	updateUser: (id, updatedUser) => {
		set((state) => ({
			users: state.users.map((user) =>
				user.id === id
					? { ...user, ...updatedUser, updatedAt: new Date().toISOString() }
					: user
			),
		}));
	},
	deleteUser: (id) => {
		set((state) => ({
			users: state.users.filter((user) => user.id !== id),
		}));
	},
	getUsersByRole: (role) => {
		return get().users.filter((user) => user.role === role);
	},
	getUsersByQuery: (query) => {
		let filteredUsers = [...get().users];

		// Apply search
		if (query.search) {
			const searchLower = query.search.toLowerCase();
			filteredUsers = filteredUsers.filter(
				(user) =>
					user.name.toLowerCase().includes(searchLower) ||
					user.email.toLowerCase().includes(searchLower)
			);
		}

		// Apply filters
		if (query.filters) {
			const { role, status, department, principalId } = query.filters;
			if (role) {
				filteredUsers = filteredUsers.filter((user) => user.role === role);
			}
			if (status) {
				filteredUsers = filteredUsers.filter((user) => user.status === status);
			}
			if (department) {
				filteredUsers = filteredUsers.filter(
					(user) => "department" in user && user.department === department
				);
			}
			if (principalId) {
				filteredUsers = filteredUsers.filter(
					(user) => "principalId" in user && user.principalId === principalId
				);
			}
		}

		// Apply sorting
		if (query.sortBy) {
			filteredUsers.sort((a, b) => {
				const aValue = a[query.sortBy!];
				const bValue = b[query.sortBy!];
				const order = query.sortOrder === "desc" ? -1 : 1;
				return aValue < bValue ? -1 * order : aValue > bValue ? 1 * order : 0;
			});
		}

		// Apply pagination
		if (query.page && query.limit) {
			const start = (query.page - 1) * query.limit;
			const end = start + query.limit;
			filteredUsers = filteredUsers.slice(start, end);
		}

		return filteredUsers;
	},
	getUserById: (id) => {
		return get().users.find((user) => user.id === id);
	},
	getEmployeesByPrincipal: (principalId) => {
		return get().users.filter(
			(user) =>
				user.role === "employee" &&
				"principalId" in user &&
				user.principalId === principalId
		);
	},
}));
