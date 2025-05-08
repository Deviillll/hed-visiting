import { Employee, UpdateUserDTO } from "@/lib/models/user";
import { useUserStore } from "@/lib/stores/user-store";
import { create } from "zustand";

interface EmployeeState {
	employees: Employee[];
	updateEmployeeRates: (id: string, interRate: number, bsRate: number) => void;
	updateEmployee: (id: string, data: UpdateUserDTO) => void;
	getEmployeeById: (id: string) => Employee | undefined;
	getEmployeesByDepartment: (department: string) => Employee[];
	getEmployeesByPrincipal: (principalId: string) => Employee[];
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
	employees: useUserStore
		.getState()
		.users.filter((user): user is Employee => user.role === "employee"),

	updateEmployeeRates: (id, interRate, bsRate) => {
		const userStore = useUserStore.getState();
		userStore.updateUser(id, {
			interRate,
			bsRate,
			lastRateUpdate: new Date().toISOString(),
		});

		set((state) => ({
			employees: state.employees.map((employee) =>
				employee.id === id
					? {
							...employee,
							interRate,
							bsRate,
							lastRateUpdate: new Date().toISOString(),
					  }
					: employee
			),
		}));
	},

	updateEmployee: (id, data) => {
		const userStore = useUserStore.getState();
		userStore.updateUser(id, data);

		set((state) => ({
			employees: state.employees.map((employee) =>
				employee.id === id
					? {
							...employee,
							...data,
							updatedAt: new Date().toISOString(),
					  }
					: employee
			),
		}));
	},

	getEmployeeById: (id) => {
		return get().employees.find((employee) => employee.id === id);
	},

	getEmployeesByDepartment: (department) => {
		return get().employees.filter(
			(employee) => employee.department === department
		);
	},

	getEmployeesByPrincipal: (principalId) => {
		return get().employees.filter(
			(employee) => employee.principalId === principalId
		);
	},
}));
