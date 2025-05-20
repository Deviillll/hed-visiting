"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleProtection } from "@/lib/auth-utils";
import { useEmployeeStore, type Employee } from "@/lib/stores/employee-store";
import { useUserStore } from "@/lib/stores/user-store";
import { Building2, Loader2, Plus, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateUserFormData {
	name: string;
	email: string;
	password: string;
	department: string;
}

// Mock data for principals
const principals = [
	{
		id: "1",
		name: "Robert Johnson",
		email: "robert.johnson@example.com",
		department: "Engineering",
		status: "active",
		employees: 24,
		avatar:
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "2",
		name: "Emma Williams",
		email: "emma.williams@example.com",
		department: "Marketing",
		status: "active",
		employees: 18,
		avatar:
			"https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "3",
		name: "James Brown",
		email: "james.brown@example.com",
		department: "Finance",
		status: "active",
		employees: 15,
		avatar:
			"https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "4",
		name: "Olivia Davis",
		email: "olivia.davis@example.com",
		department: "Human Resources",
		status: "inactive",
		employees: 12,
		avatar:
			"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "5",
		name: "William Wilson",
		email: "william.wilson@example.com",
		department: "Product",
		status: "active",
		employees: 22,
		avatar:
			"https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "6",
		name: "Sophia Martinez",
		email: "sophia.martinez@example.com",
		department: "Customer Support",
		status: "active",
		employees: 30,
		avatar:
			"https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
];

// Mock data for employees under principal
const employees = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		department: "Engineering",
		status: "active",
		interRate: 15,
		bsRate: 20,
		lastRateUpdate: "2024-03-15",
		avatar:
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		department: "Marketing",
		status: "active",
		interRate: 18,
		bsRate: 22,
		lastRateUpdate: "2024-03-10",
		avatar:
			"https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	{
		id: "3",
		name: "Mike Johnson",
		email: "mike.johnson@example.com",
		department: "Sales",
		status: "active",
		interRate: 16,
		bsRate: 21,
		lastRateUpdate: "2024-03-12",
		avatar:
			"https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
	},
	// Add more mock employees as needed
];

// Column definition for principal data table
const columns = [
	{
		key: "name" as const,
		title: "Name",
		render: (value: string, principal: (typeof principals)[0]) => (
			<div className="flex items-center gap-2">
				<Avatar className="h-8 w-8">
					<AvatarImage src={principal.avatar} alt={value} />
					<AvatarFallback>
						<UserCircle className="h-4 w-4" />
					</AvatarFallback>
				</Avatar>
				<span>{value}</span>
			</div>
		),
	},
	{
		key: "email" as const,
		title: "Email",
	},
	{
		key: "department" as const,
		title: "Department",
		render: (value: string) => <span className="font-medium">{value}</span>,
	},
	{
		key: "employees" as const,
		title: "Employees",
		render: (value: number) => (
			<Badge variant="outline" className="font-medium">
				{value}
			</Badge>
		),
	},
	{
		key: "status" as const,
		title: "Status",
		render: (value: string) => (
			<Badge
				variant={value === "active" ? "default" : "secondary"}
				className={value === "active" ? "bg-green-500" : "bg-slate-400"}
			>
				{value}
			</Badge>
		),
	},
];

// Column definition for employee data table
const employeeColumns = [
	{
		key: "name" as const,
		title: "Name",
		render: (value: string, employee: Employee) => (
			<div className="flex items-center gap-2">
				<Avatar className="h-8 w-8">
					<AvatarImage src={employee.avatar} alt={value} />
					<AvatarFallback>
						<UserCircle className="h-4 w-4" />
					</AvatarFallback>
				</Avatar>
				<span>{value}</span>
			</div>
		),
	},
	{
		key: "email" as const,
		title: "Email",
	},
	{
		key: "department" as const,
		title: "Department",
	},
	{
		key: "position" as const,
		title: "Position",
	},
	{
		key: "interRate" as const,
		title: "Inter Rate",
		render: (value: number) => `$${value}`,
	},
	{
		key: "bsRate" as const,
		title: "BS Rate",
		render: (value: number) => `$${value}`,
	},
	{
		key: "status" as const,
		title: "Status",
		render: (value: string) => (
			<Badge
				variant={value === "active" ? "default" : "secondary"}
				className={value === "active" ? "bg-green-500" : "bg-slate-400"}
			>
				{value}
			</Badge>
		),
	},
	{
		key: "actions" as const,
		title: "Actions",
		render: (_: any, employee: Employee) => (
			<Button
				variant="outline"
				size="sm"
				onClick={() => {
					handleRateUpdate(employee);
					// Switch to rate management tab
					const tabsList = document.querySelector('[role="tablist"]');
					const rateManagementTab = tabsList?.querySelector(
						'[value="rate-management"]'
					) as HTMLElement;
					rateManagementTab?.click();
				}}
			>
				Update Rates
			</Button>
		),
	},
];

export default function PrincipalsPage() {
	const { isLoading } = useRoleProtection(["principal"]);
	const { employees, updateEmployeeRates } = useEmployeeStore();
	const { addUser } = useUserStore();
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);
	const [newInterRate, setNewInterRate] = useState("");
	const [newBsRate, setNewBsRate] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [createFormData, setCreateFormData] = useState<CreateUserFormData>({
		name: "",
		email: "",
		password: "",
		department: "",
	});

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const handleCreateUser = () => {
		if (
			!createFormData.name ||
			!createFormData.email ||
			!createFormData.password ||
			!createFormData.department
		) {
			toast.error("Please fill in all fields");
			return;
		}

		addUser({
			...createFormData,
			role: "employee",
			avatar:
				"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
		});

		toast.success("Employee created successfully");
		setIsCreateDialogOpen(false);
		setCreateFormData({
			name: "",
			email: "",
			password: "",
			department: "",
		});
	};

	const handleRateUpdate = (employee: Employee) => {
		setSelectedEmployee(employee);
		setNewInterRate(employee.interRate.toString());
		setNewBsRate(employee.bsRate.toString());
	};

	const submitRateUpdate = () => {
		if (!selectedEmployee) return;

		const interRate = parseInt(newInterRate);
		const bsRate = parseInt(newBsRate);

		if (isNaN(interRate) || isNaN(bsRate)) {
			toast.error("Please enter valid numbers for rates");
			return;
		}

		if (interRate < 100 || interRate > 2000 || bsRate < 100 || bsRate > 2000) {
			toast.error("Rates must be between 100 and 2000");
			return;
		}

		updateEmployeeRates(selectedEmployee.id, interRate, bsRate);
		toast.success("Rates updated successfully");

		// Reset the form
		setSelectedEmployee(null);
		setNewInterRate("");
		setNewBsRate("");
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
					<Building2 className="h-6 w-6 text-green-500" />
					Principal Dashboard
				</h2>
				<p className="text-muted-foreground">
					Manage your employees and their rates
				</p>
			</div>

			<Tabs defaultValue="employees" className="space-y-4">
				<TabsList>
					<TabsTrigger value="employees">Employees</TabsTrigger>
					<TabsTrigger value="rate-management">Rate Management</TabsTrigger>
				</TabsList>

				<TabsContent value="employees">
					<Card className="p-6">
						<div className="flex justify-end mb-4">
							<Dialog
								open={isCreateDialogOpen}
								onOpenChange={setIsCreateDialogOpen}
							>
								<DialogTrigger asChild>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Add Employee
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Add New Employee</DialogTitle>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												value={createFormData.name}
												onChange={(e) =>
													setCreateFormData({
														...createFormData,
														name: e.target.value,
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={createFormData.email}
												onChange={(e) =>
													setCreateFormData({
														...createFormData,
														email: e.target.value,
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="password">Password</Label>
											<Input
												id="password"
												type="password"
												value={createFormData.password}
												onChange={(e) =>
													setCreateFormData({
														...createFormData,
														password: e.target.value,
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="department">Department</Label>
											<Input
												id="department"
												value={createFormData.department}
												onChange={(e) =>
													setCreateFormData({
														...createFormData,
														department: e.target.value,
													})
												}
											/>
										</div>
										<Button onClick={handleCreateUser} className="w-full">
											Add Employee
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<DataTable
							data={employees}
							columns={employeeColumns}
							searchField="name"
							itemsPerPage={5}
						/>
					</Card>
				</TabsContent>

				<TabsContent value="rate-management">
					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">Update Employee Rates</h3>

							{selectedEmployee ? (
								<div className="space-y-4">
									<div className="grid gap-4">
										<div className="space-y-2">
											<Label>Employee</Label>
											<div className="font-medium">{selectedEmployee.name}</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="interRate">Inter Rate ($)</Label>
												<Input
													id="interRate"
													type="number"
													min="100"
													max="2000"
													value={newInterRate}
													onChange={(e) => setNewInterRate(e.target.value)}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="bsRate">BS Rate ($)</Label>
												<Input
													id="bsRate"
													type="number"
													min="100"
													max="2000"
													value={newBsRate}
													onChange={(e) => setNewBsRate(e.target.value)}
												/>
											</div>
										</div>
									</div>

									<div className="flex gap-2">
										<Button onClick={submitRateUpdate}>Update Rates</Button>
										<Button
											variant="outline"
											onClick={() => {
												setSelectedEmployee(null);
												setNewInterRate("");
												setNewBsRate("");
											}}
										>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center text-muted-foreground">
									Select an employee from the Employees tab to update their
									rates
								</div>
							)}
						</div>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}