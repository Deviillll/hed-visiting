"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Admin } from "@/components/dashboard/AdminDialog";
import { AdminPageHeader } from "@/components/dashboard/AdminHeader";
import { AdminTable } from "@/components/dashboard/AdminTable";
import axios from "@/utils/axios";
import { toast } from "sonner";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("Rendering AdminsPage");

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin"); // your admin API endpoint
      const rawAdmins = res.data;

      const transformed = rawAdmins.map((a: any) => ({
        id: a._id,
        name: a.name,
        email: a.email,
        status: a.status ? "Active" : "Inactive",
        canAddEmployee: a.canAddEmployee,
        allowVerification: a.allowVerification,
        allowDataEntry: a.allowDataEntry,
        allowBilling: a.allowBilling,
        allowDeletion: a.allowDeletion,
        canCreateAdmin: a.canCreateAdmin,
        departmentId: a.department?._id || "",
        departmentName: a.department?.name || "",
        departmentCode: a.department?.code || "",
      }));

      setAdmins(transformed);
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // useCallback to memoize handlers to prevent unnecessary re-renders downstream
  const handleUpdate = useCallback(
    async (
      data: Partial<Admin> & { password?: string; departmentId?: string }
    ) => {
      try {
        if (data.id) {
          // update
          await axios.put(`/admin/${data.id}`, data);
          toast.success("Admin updated");
        } else {
          // create
          const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            department: data.departmentId,
            resolverPermissions: {
              canAddEmployee: data.canAddEmployee ?? false,
              allowVerification: data.allowVerification ?? false,
              allowDataEntry: data.allowDataEntry ?? false,
              allowBilling: data.allowBilling ?? false,
              allowDeletion: data.allowDeletion ?? false,
              canCreateAdmin: data.canCreateAdmin ?? false,
            },
          };
          console.log(payload);
          await axios.post("/admin", payload);
          toast.success("Admin created");
        }
        await fetchAdmins(); // reload list
      } catch (error) {
        toast.error("Failed to save admin");
      }
    },
    [fetchAdmins]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/admin/${id}`);
        toast.success("Admin deleted");
        await fetchAdmins();
      } catch (error) {
        toast.error("Failed to delete admin");
      }
    },
    [fetchAdmins]
  );

  const handleStatusToggle = useCallback(
    async (dept: Admin) => {
      try {
        await axios.patch(`/department/${dept.id}`, {
          isActive: dept.status === "Active" ? false : true,
        });
        toast.success(
          `Department marked as ${
            dept.status === "Active" ? "Inactive" : "Active"
          }`
        );
        await fetchAdmins();
      } catch (error) {
        toast.error("Failed to update status");
      }
    },
    [fetchAdmins]
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader onAdd={handleUpdate} />
      <Card className="p-6">
        <AdminTable
          admins={admins}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
      </Card>
    </div>
  );
}
