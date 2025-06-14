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
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
     finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // useCallback to memoize handlers to prevent unnecessary re-renders downstream
  const handleUpdate = useCallback(
    async (
      data: Partial<Admin> & { password?: string; }
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
          if (!payload.name || !payload.email || !payload.password) {
            toast.error("Name, email and password are required");
            return;
          }
          await axios.post("/admin", payload);
          toast.success("Admin created");
        }
        await fetchAdmins(); // reload list
      }
      catch (error: any) {
            toast.error("An error occurred", {
              description: error.response?.data?.message || "Please try again later",
              position: "top-right",
              duration: 2000,
            });
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
      } catch (error: any) {
            toast.error("An error occurred", {
              description: error.response?.data?.message || "Please try again later",
              position: "top-right",
              duration: 2000,
            });
          }
    },
    [fetchAdmins]
  );

  const handleStatusToggle = useCallback(
    async (dept: Admin) => {
      try {
        await axios.patch(`/admin/${dept.id}`, {
          status: dept.status === "Active" ? "Inactive" : "Active",
        });
        toast.success(
          `Admin marked as ${
            dept.status === "Active" ? "inactive" : "active"
          }`
        );
        await fetchAdmins();
      } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
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
