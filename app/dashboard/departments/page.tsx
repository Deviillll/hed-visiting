"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRoleProtection } from "@/lib/auth-utils";
import { Department } from "@/components/dashboard/DepartmentDialog";
import { DepartmentPageHeader } from "@/components/dashboard/DepartmentHeader";
import { DepartmentTable } from "@/components/dashboard/DepartmentTable";
import axios from "@/utils/axios";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const { isLoading } = useRoleProtection(["superadmin", "admin", "principal"]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("Rendering DepartmentsPage");

  // ✅ Fetch departments on load
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/department");
      const rawDepartments = res.data;

      const transformed = rawDepartments.map((d: any) => ({
        id: d._id,
        name: d.name,
        code: d.code,
        hod: d.hodName ?? "N/A",
        avatar: d.avatar ?? "", // or generate initials/fallback
        status: d.isActive ? "Active" : "Inactive",
        totalEmployees: d.totalEmployees || 0, // assuming this field exists
        head: d.head || "N/A", // assuming this field exists
      }));

      setDepartments(transformed);
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Add or update department
  const handleUpdate = async (data: Partial<Department>) => {
    try {
      const payload = {
        name: data.name,
        code: data.code,
        hodName: data.hod, // backend expects `hodName`
      };

      if (data.id) {
        await axios.put(`/department/${data.id}`, payload);
        toast.success("Department updated");
      } else {
        await axios.post("/department", payload);
        toast.success("Department added");
      }

      await fetchDepartments(); // Refetch to sync with latest
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };

  // ✅ Toggle department status
  const handleStatusToggle = async (dept: Department) => {
    try {
      await axios.patch(`/department/${dept.id}`, {
        isActive: dept.status === "Active" ? false : true,
      });
      toast.success(
        `Department marked as ${
          dept.status === "Active" ? "Inactive" : "Active"
        }`
      );
      await fetchDepartments(); // ✅ refetch to show updated state
    } catch (error: any) {
          toast.error("An error occurred", {
            description: error.response?.data?.message || "Please try again later",
            position: "top-right",
            duration: 2000,
          });
        }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/department/${id}`);
      toast.success("Department deleted");
      await fetchDepartments(); // re-fetch the updated list
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DepartmentPageHeader onAdd={handleUpdate} />
      <Card className="p-6">
        <DepartmentTable
          departments={departments}
          onStatusToggle={handleStatusToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete} // 🔥 NEW
        />
      </Card>
    </div>
  );
}
