"use client";

import { Grid } from "lucide-react";
import { DepartmentDialog } from "./DepartmentDialog";

interface Department {
	id: number;
	name: string;
	code: string;
	hod: string;
	status: "Active" | "Inactive";
	avatar?: string;
}

interface Props {
	onAdd: (data: Partial<Department>) => void;
}

export function DepartmentPageHeader({ onAdd }: Props) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
					<Grid className="h-6 w-6 text-blue-500" />
					Departments
				</h2>
				<p className="text-muted-foreground">Manage departments across your organization</p>
			</div>
			<DepartmentDialog onSave={onAdd} triggerType="button" />
		</div>
	);
}
