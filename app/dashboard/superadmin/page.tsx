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
import { useUserStore } from "@/lib/stores/user-store";
import { UserRole } from "@/lib/types";
import { Building2, Loader2, Plus, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateUserFormData {
	name: string;
	email: string;
	password: string;
	role: UserRole;
}

export default function SuperAdminPage() {
	const { isLoading } = useRoleProtection(["superadmin"]);
	const { users, addUser, deleteUser } = useUserStore();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [createFormData, setCreateFormData] = useState<CreateUserFormData>({
		name: "",
		email: "",
		password: "",
		role: "admin",
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
			!createFormData.password
		) {
			toast.error("Please fill in all fields");
			return;
		}

		addUser({
			...createFormData,
			avatar:
				"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
		});

		toast.success("User created successfully");
		setIsCreateDialogOpen(false);
		setCreateFormData({
			name: "",
			email: "",
			password: "",
			role: "admin",
		});
	};

	const handleDeleteUser = (id: string) => {
		deleteUser(id);
		toast.success("User deleted successfully");
	};

	const userColumns = [
		{
			key: "name" as const,
			title: "Name",
			render: (value: string, user: any) => (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.avatar} alt={value} />
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
			key: "role" as const,
			title: "Role",
			render: (value: string) => (
				<Badge variant="outline" className="capitalize">
					{value}
				</Badge>
			),
		},
		{
			key: "actions" as const,
			title: "Actions",
			render: (_: any, user: any) => (
				<Button
					variant="destructive"
					size="sm"
					onClick={() => handleDeleteUser(user.id)}
				>
					Delete
				</Button>
			),
		},
	];

	const admins = users.filter((user) => user.role === "admin");
	const principals = users.filter((user) => user.role === "principal");
	const employees = users.filter((user) => user.role === "employee");

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
					<Building2 className="h-6 w-6 text-purple-500" />
					Super Admin Dashboard
				</h2>
				<p className="text-muted-foreground">
					Manage system users and their roles
				</p>
			</div>

			<Tabs defaultValue="admins" className="space-y-4">
				<TabsList>
					<TabsTrigger value="admins">Admins</TabsTrigger>
					<TabsTrigger value="principals">Principals</TabsTrigger>
					<TabsTrigger value="employees">Employees</TabsTrigger>
				</TabsList>

				<TabsContent value="admins">
					<Card className="p-6">
						<div className="flex justify-end mb-4">
							<Dialog
								open={isCreateDialogOpen}
								onOpenChange={setIsCreateDialogOpen}
							>
								<DialogTrigger asChild>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Create Admin
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create New Admin</DialogTitle>
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
										<Button onClick={handleCreateUser} className="w-full">
											Create Admin
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<DataTable
							data={admins}
							columns={userColumns}
							searchField="name"
							itemsPerPage={5}
						/>
					</Card>
				</TabsContent>

				<TabsContent value="principals">
					<Card className="p-6">
						<div className="flex justify-end mb-4">
							<Dialog
								open={isCreateDialogOpen}
								onOpenChange={setIsCreateDialogOpen}
							>
								<DialogTrigger asChild>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Create Principal
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create New Principal</DialogTitle>
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
										<Button
											onClick={() => {
												setCreateFormData({
													...createFormData,
													role: "principal",
												});
												handleCreateUser();
											}}
											className="w-full"
										>
											Create Principal
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<DataTable
							data={principals}
							columns={userColumns}
							searchField="name"
							itemsPerPage={5}
						/>
					</Card>
				</TabsContent>

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
										Create Employee
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Create New Employee</DialogTitle>
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
										<Button
											onClick={() => {
												setCreateFormData({
													...createFormData,
													role: "employee",
												});
												handleCreateUser();
											}}
											className="w-full"
										>
											Create Employee
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<DataTable
							data={employees}
							columns={userColumns}
							searchField="name"
							itemsPerPage={5}
						/>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}