import { create } from "zustand";

export interface Employee {
	id: string;
	name: string;
	email: string;
	department: string;
	position: string;
	status: "active" | "inactive";
	interRate: number;
	bsRate: number;
	avatar: string;
}

interface EmployeeState {
	employees: Employee[];
	updateEmployeeRates: (id: string, interRate: number, bsRate: number) => void;
	toggleEmployeeStatus: (id: string) => void;
}

// Initial employee data
const initialEmployees: Employee[] = [
	{
		id: "1",
		name: "Alex Johnson",
		email: "alex.johnson@example.com",
		department: "Engineering",
		position: "Software Developer",
		status: "active",
		interRate: 150,
		bsRate: 200,
		avatar:
			"https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "2",
		name: "Maria Garcia",
		email: "maria.garcia@example.com",
		department: "Marketing",
		position: "Marketing Specialist",
		status: "active",
		interRate: 120,
		bsRate: 180,
		avatar:
			"https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "3",
		name: "David Kim",
		email: "david.kim@example.com",
		department: "Finance",
		position: "Financial Analyst",
		status: "inactive",
		interRate: 200,
		bsRate: 250,
		avatar:
			"https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "4",
		name: "Sarah Robinson",
		email: "sarah.robinson@example.com",
		department: "Human Resources",
		position: "HR Coordinator",
		status: "active",
		interRate: 130,
		bsRate: 170,
		avatar:
			"https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "5",
		name: "Michael Lee",
		email: "michael.lee@example.com",
		department: "Product",
		position: "Product Manager",
		status: "active",
		interRate: 180,
		bsRate: 220,
		avatar:
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "6",
		name: "Jennifer Smith",
		email: "jennifer.smith@example.com",
		department: "Customer Support",
		position: "Support Specialist",
		status: "active",
		interRate: 110,
		bsRate: 150,
		avatar:
			"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "7",
		name: "Carlos Mendez",
		email: "carlos.mendez@example.com",
		department: "Engineering",
		position: "QA Engineer",
		status: "active",
		interRate: 140,
		bsRate: 190,
		avatar:
			"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "8",
		name: "Laura Wilson",
		email: "laura.wilson@example.com",
		department: "Marketing",
		position: "Content Writer",
		status: "inactive",
		interRate: 125,
		bsRate: 165,
		avatar:
			"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
];

export const useEmployeeStore = create<EmployeeState>((set) => ({
	employees: initialEmployees,
	updateEmployeeRates: (id: string, interRate: number, bsRate: number) =>
		set((state) => ({
			employees: state.employees.map((emp) =>
				emp.id === id ? { ...emp, interRate, bsRate } : emp
			),
		})),
	toggleEmployeeStatus: (id: string) =>
		set((state) => ({
			employees: state.employees.map((emp) =>
				emp.id === id
					? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
					: emp
			),
		})),
}));
