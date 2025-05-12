import {
	CreateUserDTO,
	UpdateUserDTO,
	User,
	UserQuery,
} from "@/lib/models/user";
import { UserRole } from "@/lib/types";
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

// Define departments
const departments = [
	"Engineering",
	"Marketing",
	"Finance",
	"Human Resources",
	"Product",
	"Customer Support",
	"Sales",
	"Research",
	"Legal",
	"Operations",
];

// Define positions
const positions = [
	"Junior Developer",
	"Senior Developer",
	"Team Lead",
	"Project Manager",
	"Marketing Specialist",
	"Content Writer",
	"Financial Analyst",
	"HR Specialist",
	"Product Manager",
	"Support Specialist",
	"Sales Representative",
	"Researcher",
	"Legal Advisor",
	"Operations Manager",
];

// Function to generate random users
const generateUsers = (count: number) => {
	const users: User[] = [];

	// Create super admin user (always active)
	users.push({
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
	});

	// Create 9 admin users (2 will be active)
	for (let i = 0; i < 9; i++) {
		users.push({
			id: (users.length + 1).toString(),
			email: `admin${i + 1}@example.com`,
			password: "password",
			name: `Admin User ${i + 1}`,
			role: "admin",
			avatar:
				"https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100",
			status: i < 2 ? "active" : "inactive", // First 2 admins are active
			managedDepartments: [
				departments[Math.floor(Math.random() * departments.length)],
				departments[Math.floor(Math.random() * departments.length)],
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	}

	// Create 10 principal users (only 1 will be active)
	for (let i = 0; i < 10; i++) {
		const dept = departments[i % departments.length];
		users.push({
			id: (users.length + 1).toString(),
			email: `principal${i + 1}@example.com`,
			password: "password",
			name: `Principal User ${i + 1}`,
			role: "principal",
			avatar:
				"https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
			status: i === 0 ? "active" : "inactive", // Only the first principal is active
			department: dept,
			employees: [], // Will be filled after creating employees
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	}

	// Create remaining users as employees (80 employees, 25% will be active)
	const remainingCount = count - users.length;
	for (let i = 0; i < remainingCount; i++) {
		const deptIndex = i % departments.length;
		const posIndex = i % positions.length;
		const principalId = (
			10 +
			Math.floor(deptIndex / (departments.length / 10)) +
			1
		).toString();

		users.push({
			id: (users.length + 1).toString(),
			email: `employee${i + 1}@example.com`,
			password: "password",
			name: `Employee User ${i + 1}`,
			role: "employee",
			avatar:
				"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
			status: i < remainingCount * 0.25 ? "active" : "inactive", // 25% of employees are active
			department: departments[deptIndex],
			position: positions[posIndex],
			interRate: 15 + Math.floor(Math.random() * 20),
			bsRate: 20 + Math.floor(Math.random() * 30),
			lastRateUpdate: new Date().toISOString(),
			principalId: principalId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		// Add employee ID to their principal's employees array
		const principal = users.find(
			(u) => u.id === principalId && u.role === "principal"
		);
		if (principal && "employees" in principal) {
			principal.employees.push(users[users.length - 1].id);
		}
	}

	return users;
};

// Generate 100 users
const initialUsers: User[] = generateUsers(100);

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
