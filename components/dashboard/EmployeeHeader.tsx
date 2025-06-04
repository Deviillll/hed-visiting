

"use client";

import { memo } from "react";
import { Briefcase, UserPlus } from "lucide-react";
import { Admin, AdminDialog } from "@/components/dashboard/AdminDialog";
import { AddEmployee } from "./AddEmployees";

interface Props {
  onAdd: (data: Partial<Admin>) => void;
}

function EmployeePageHeaderComponent({ onAdd }: Props) {
  console.log("Rendering EmployeePageHeader");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-amber-500" />
          Employees
        </h2>
        <p className="text-muted-foreground">
          Manage employees across your organization
        </p>
      </div>
      <AddEmployee onSave={onAdd} triggerType="button" />
    </div>
  );
}

export const EmployeePageHeader = memo(EmployeePageHeaderComponent);
