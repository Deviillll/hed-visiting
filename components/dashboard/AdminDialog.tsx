"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/utils/axios";
import DepartmentSelect from "./DepartmentSelect";

export interface Admin {
  id: string;
  name: string;
  email: string;
  status?: "Active" | "Inactive";
  canAddEmployee: boolean;
  allowVerification?: boolean;
  allowDataEntry?: boolean;
  allowBilling: boolean;
  allowDeletion?: boolean;
  canCreateAdmin: boolean;
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
}

interface Props {
  admin?: Partial<Admin>;
  onSave: (data: Partial<Admin> & { password?: string }) => void;
  triggerType?: "button" | "icon";
}

export function AdminDialog({ admin, onSave, triggerType = "icon" }: Props) {
  console.log("Rendering AdminDialog");

  const initialState = useMemo(
    () => ({
      name: admin?.name || "",
      email: admin?.email || "",
      password: "",
      departmentId: admin?.departmentId || "",
      permissions: {
        canAddEmployee: admin?.canAddEmployee ?? false,
        allowVerification: admin?.allowVerification ?? false,
        allowDataEntry: admin?.allowDataEntry ?? false,
        allowBilling: admin?.allowBilling ?? false,
        allowDeletion: admin?.allowDeletion ?? false,
        canCreateAdmin: admin?.canCreateAdmin ?? false,
      },
    }),
    [admin]
  );

  const [form, setForm] = useState(initialState);

  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) setForm(initialState);
  }, [open, initialState]);

  const handleInputChange = useCallback(
    (key: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handlePermissionToggle = useCallback(
    (permKey: keyof typeof form.permissions) => {
      setForm((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permKey]: !prev.permissions[permKey],
        },
      }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (isSaving) return;

    const { name, email, password, departmentId, permissions } = form;

    if (!name || !email || (!admin && !password) || !departmentId) {
      toast.error("All fields are required");
      return;
    }

    setIsSaving(true);
    onSave({
      id: admin?.id,
      name,
      email,
      ...(password && { password }),
      departmentId,
      ...permissions,
    });

    setOpen(false);

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  }, [form, isSaving, onSave, admin]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerType === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={admin ? "Edit admin" : "Add admin"}
          >
            {admin ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Admin
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{admin ? "Edit Admin" : "Add Admin"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <DepartmentSelect
                value={form.departmentId}
                onChange={(id) => handleInputChange("departmentId", id)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {!admin && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label>Permissions</Label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(form.permissions).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      handlePermissionToggle(
                        key as keyof typeof form.permissions
                      )
                    }
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isSaving}>
            {admin ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
