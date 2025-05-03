"use client";

import {
	addEmployee,
	deleteEmployee,
	getEmployees,
	updateEmployee,
} from "@/app/actions/employee";
import { Employee, columns } from "@/app/types/employee";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export function EmployeeCRUD() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);
	const [formData, setFormData] = useState<Partial<Employee>>({
		isActive: true,
		interRate: 0,
		bsClassRate: 0,
	});

	const [addState, addAction] = useActionState(addEmployee, {
		success: false,
		error: null,
	});
	const [updateState, updateAction] = useActionState(updateEmployee, {
		success: false,
		error: null,
	});
	const [deleteState, deleteAction] = useActionState(deleteEmployee, {
		success: false,
		error: null,
	});

	useEffect(() => {
		const fetchEmployees = async () => {
			const data = await getEmployees();
			setEmployees(data);
		};
		fetchEmployees();
	}, [addState.success, updateState.success, deleteState.success]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formDataObj = new FormData();

		if (selectedEmployee) {
			formDataObj.append("id", selectedEmployee.id);
		}

		Object.entries(formData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formDataObj.append(key, value.toString());
			}
		});

		if (selectedEmployee) {
			updateAction(formDataObj);
		} else {
			addAction(formDataObj);
		}

		setIsDialogOpen(false);
		setFormData({
			isActive: true,
			interRate: 0,
			bsClassRate: 0,
		});
		setSelectedEmployee(null);
	};

	const handleEdit = (employee: Employee) => {
		setSelectedEmployee(employee);
		setFormData(employee);
		setIsDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		const formData = new FormData();
		formData.append("id", id);
		deleteAction(formData);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Employees</h2>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Employee
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>
								{selectedEmployee ? "Edit Employee" : "Add New Employee"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										value={formData.name || ""}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="fatherName">Father Name</Label>
									<Input
										id="fatherName"
										name="fatherName"
										value={formData.fatherName || ""}
										onChange={(e) =>
											setFormData({ ...formData, fatherName: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="bankAccountNumber">Bank Account Number</Label>
									<Input
										id="bankAccountNumber"
										name="bankAccountNumber"
										value={formData.bankAccountNumber || ""}
										onChange={(e) =>
											setFormData({
												...formData,
												bankAccountNumber: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="cnic">CNIC</Label>
									<Input
										id="cnic"
										name="cnic"
										value={formData.cnic || ""}
										onChange={(e) =>
											setFormData({ ...formData, cnic: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="personnelNumber">Personnel Number</Label>
									<Input
										id="personnelNumber"
										name="personnelNumber"
										value={formData.personnelNumber || ""}
										onChange={(e) =>
											setFormData({
												...formData,
												personnelNumber: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phoneNumber">Phone Number</Label>
									<Input
										id="phoneNumber"
										name="phoneNumber"
										value={formData.phoneNumber || ""}
										onChange={(e) =>
											setFormData({ ...formData, phoneNumber: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email || ""}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="username">Username</Label>
									<Input
										id="username"
										name="username"
										value={formData.username || ""}
										onChange={(e) =>
											setFormData({ ...formData, username: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password || ""}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="interRate">Inter Rate</Label>
									<Input
										id="interRate"
										name="interRate"
										type="number"
										value={formData.interRate || 0}
										onChange={(e) =>
											setFormData({
												...formData,
												interRate: parseFloat(e.target.value),
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="bsClassRate">BS Class Rate</Label>
									<Input
										id="bsClassRate"
										name="bsClassRate"
										type="number"
										value={formData.bsClassRate || 0}
										onChange={(e) =>
											setFormData({
												...formData,
												bsClassRate: parseFloat(e.target.value),
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="isActive">Active Status</Label>
									<Switch
										id="isActive"
										name="isActive"
										checked={formData.isActive}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, isActive: checked })
										}
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit">
									{selectedEmployee ? "Update" : "Add"} Employee
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{(addState.error || updateState.error || deleteState.error) && (
				<div className="text-red-500">
					{addState.error || updateState.error || deleteState.error}
				</div>
			)}

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.accessorKey}>{column.header}</TableHead>
							))}
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{employees.map((employee) => (
							<TableRow key={employee.id}>
								{columns.map((column) => (
									<TableCell key={column.accessorKey}>
										{column.cell
											? column.cell({
													row: {
														getValue: (key: string) =>
															employee[key as keyof Employee],
													},
											  })
											: employee[column.accessorKey as keyof Employee]}
									</TableCell>
								))}
								<TableCell>
									<div className="flex space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(employee)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(employee.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
