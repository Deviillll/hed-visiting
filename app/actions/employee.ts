"use server";

import { Employee } from "@/app/types/employee";

// In a real application, this would be replaced with a database
let employees: Employee[] = [];

export async function getEmployees() {
	return employees;
}

export async function addEmployee(prevState: any, formData: FormData) {
	try {
		const newEmployee: Employee = {
			id: Math.random().toString(36).substr(2, 9),
			name: formData.get("name") as string,
			fatherName: formData.get("fatherName") as string,
			bankAccountNumber: formData.get("bankAccountNumber") as string,
			cnic: formData.get("cnic") as string,
			personnelNumber: formData.get("personnelNumber") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			email: formData.get("email") as string,
			username: formData.get("username") as string,
			password: formData.get("password") as string,
			isActive: formData.get("isActive") === "true",
			interRate: parseFloat(formData.get("interRate") as string),
			bsClassRate: parseFloat(formData.get("bsClassRate") as string),
		};

		employees.push(newEmployee);
		return { success: true, error: null };
	} catch (error) {
		return { success: false, error: "Failed to add employee" };
	}
}

export async function updateEmployee(prevState: any, formData: FormData) {
	try {
		const id = formData.get("id") as string;
		const updatedEmployee: Partial<Employee> = {
			name: formData.get("name") as string,
			fatherName: formData.get("fatherName") as string,
			bankAccountNumber: formData.get("bankAccountNumber") as string,
			cnic: formData.get("cnic") as string,
			personnelNumber: formData.get("personnelNumber") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			email: formData.get("email") as string,
			username: formData.get("username") as string,
			password: formData.get("password") as string,
			isActive: formData.get("isActive") === "true",
			interRate: parseFloat(formData.get("interRate") as string),
			bsClassRate: parseFloat(formData.get("bsClassRate") as string),
		};

		employees = employees.map((emp) =>
			emp.id === id ? { ...emp, ...updatedEmployee } : emp
		);
		return { success: true, error: null };
	} catch (error) {
		return { success: false, error: "Failed to update employee" };
	}
}

export async function deleteEmployee(prevState: any, formData: FormData) {
	try {
		const id = formData.get("id") as string;
		employees = employees.filter((emp) => emp.id !== id);
		return { success: true, error: null };
	} catch (error) {
		return { success: false, error: "Failed to delete employee" };
	}
}
