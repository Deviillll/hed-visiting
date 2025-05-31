"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Department, DepartmentDialog } from "./DepartmentDialog";
import { UserCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
	departments: Department[];
	onStatusToggle: (dept: Department) => void;
	onUpdate: (data: Partial<Department>) => void;
	onDelete: (id: string) => void; // 🔥 NEW
}

export function DepartmentTable({
	departments,
	onStatusToggle,
	onUpdate,
	onDelete,
}: Props) {
	const handleDelete = (dept: Department) => {
		if (confirm(`Are you sure you want to delete "${dept.name}" department?`)) {
			onDelete(String(dept.id));
		}
	};

	const columns = [
		{
			key: "name" as const,
			title: "Name",
			render: (value: string, dept: Department) => (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={dept.avatar} alt={value} />
						<AvatarFallback>
							<UserCircle className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
					<span>{value}</span>
				</div>
			),
		},
		{ key: "code" as const, title: "Code" },
		{ key: "hod" as const, title: "HOD Name" },
		{ key: "totalEmployees" as const, title: "Total Employees" },
		{
			key: "status" as const,
			title: "Status",
			render: (value: string, dept: Department) => (
				<Badge
					className={`cursor-pointer ${
						value === "Active" ? "bg-green-500" : "bg-gray-400"
					}`}
					onClick={() => {
						onStatusToggle(dept);
						toast.success(
							`Department marked as ${
								dept.status === "Active" ? "Inactive" : "Active"
							}`
						);
					}}
				>
					{value}
				</Badge>
			),
		},
		{
			key: "actions" as const,
			title: "Actions",
			render: (_: any, dept: Department) => (
				<div className="flex gap-x-5">
					<DepartmentDialog department={dept} onSave={onUpdate} />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleDelete(dept)}
						className="text-red-500 hover:bg-red-100"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	return (
		<DataTable
			data={departments}
			columns={columns}
			searchField="name"
			itemsPerPage={5}
		/>
	);
}
