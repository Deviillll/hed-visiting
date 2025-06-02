"use client";
import { memo, useCallback, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Admin, AdminDialog } from "@/components/dashboard/AdminDialog";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

interface Props {
  admins: Admin[];
  onUpdate: (data: Partial<Admin>) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (admin: Admin) => void;
}

function AdminTableComponent({
  admins,
  onUpdate,
  onDelete,
  onStatusToggle,
}: Props) {
  console.log("Rendering AdminTable");

  const handleDelete = useCallback(
    (admin: Admin) => {
      if (confirm(`Delete admin "${admin.name}"?`)) {
        onDelete(admin.id);
      }
    },
    [onDelete]
  );

  const columns = useMemo(
    () => [
      { key: "name" as const, title: "Name" },
      { key: "email" as const, title: "Email" },
      {
        key: "custom" as const,
        title: "Permissions",
        render: (_: any, admin: Admin) => {
          const allPermissions = [
            { label: "Add Emp", key: "canAddEmployee" },
            { label: "Verify", key: "allowVerification" },
            { label: "Data Entry", key: "allowDataEntry" },
            { label: "Billing", key: "allowBilling" },
            { label: "Delete", key: "allowDeletion" },
            { label: "Add Admin", key: "canCreateAdmin" },
          ];

          return (
            <div className="flex flex-wrap gap-1 max-w-[250px]">
              {allPermissions.map((perm, idx) => {
                const isActive = admin[perm.key as keyof Admin];
                return (
                  <Badge
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded ${
                      isActive ? "bg-green-500" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {perm.label}
                  </Badge>
                );
              })}
            </div>
          );
        },
      },
      {
        key: "department" as const,
        title: "Department",
        render: (_: any, admin: Admin) => (
          <span className="text-sm text-muted-foreground">
            {admin.departmentCode || "—"}
          </span>
        ),
      },
      {
        key: "status" as const,
        title: "Status",
        render: (value: string, admin: Admin) => (
          <Badge
            className={`cursor-pointer ${
              value === "Active" ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={() => {
              onStatusToggle(admin);
              toast.success(
                `Admin marked as ${
                  admin.status === "Active" ? "Inactive" : "Active"
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
        render: (_: any, admin: Admin) => (
          <div className="flex gap-x-2">
            <AdminDialog admin={admin} onSave={onUpdate} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(admin)}
              className="text-red-500 hover:bg-red-100"
              aria-label="Delete admin"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onStatusToggle, onUpdate, handleDelete]
  );

  return (
    <DataTable
      data={admins}
      columns={columns}
      searchField="name"
      itemsPerPage={5}
    />
  );
}

export const AdminTable = memo(AdminTableComponent);
