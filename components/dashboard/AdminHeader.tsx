"use client";

import { memo } from "react";
import { UserPlus } from "lucide-react";
import { Admin, AdminDialog } from "@/components/dashboard/AdminDialog";

interface Props {
  onAdd: (data: Partial<Admin>) => void;
}

function AdminPageHeaderComponent({ onAdd }: Props) {
  console.log("Rendering AdminPageHeader");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-blue-500" />
          Admins
        </h2>
        <p className="text-muted-foreground">
          Manage admins across your organization
        </p>
      </div>
      <AdminDialog onSave={onAdd} triggerType="button" />
    </div>
  );
}

export const AdminPageHeader = memo(AdminPageHeaderComponent);
