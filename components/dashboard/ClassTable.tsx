"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Class, ClassDialog } from "./ClassDialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface Props {
  classes: Class[];
  onUpdate: (data: Partial<Class>) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (cls: Class) => void; // 🔥 NEW
}

export function ClassTable({ classes, onUpdate, onDelete, onStatusToggle }: Props) {
  const handleDelete = (cls: Class) => {
    if (confirm(`Delete class "${cls.name}"?`)) {
      onDelete(String(cls.id));
    }
  };

  const columns = [
    {
      key: "name" as const,
      title: "Class Name",
    },
    {
      key: "createdBy" as const,
      title: "Created By",
      render: (_: any, cls: Class) => (
        <span>{(cls.createdBy as any)?.name ?? "Unknown"}</span>
      ),
    },
    {
                key: "status" as const,
                title: "Status",
                render: (value: string, cls: Class) => (
                    <Badge
                        className={`cursor-pointer ${
                            value === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                        onClick={() => {
                            onStatusToggle(cls);
                            toast.success(
                                `Class marked as ${
                                    cls.status === "Active" ? "Inactive" : "Active"
                                }`
                            );
                        }}
                    >
                        {value}
                    </Badge>
                ),
            }
    ,
    {
      key: "actions" as const,
      title: "Actions",
      render: (_: any, cls: Class) => (
        <div className="flex gap-x-5">
          <ClassDialog classItem={cls} onSave={onUpdate} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(cls)}
            className="text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable data={classes} columns={columns} searchField="name" itemsPerPage={5} />
  );
}
