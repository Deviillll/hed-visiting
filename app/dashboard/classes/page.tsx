"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "@/utils/axios";
import { Class } from "@/components/dashboard/ClassDialog";
import { ClassHeader } from "@/components/dashboard/ClassHeader";
import { ClassTable } from "@/components/dashboard/ClassTable";
import { useRoleProtection } from "@/lib/auth-utils";

export default function ClassesPage() {
  const { isLoading } = useRoleProtection(["superadmin", "admin","principal"]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/class");
      const raw = res.data;

      const transformed = raw.map((c: any) => ({
        id: c._id,
        name: c.name,
        createdBy: c.createdBy ?? "N/A",
        status: c.isActive ? "Active" : "Inactive",
      }));

      setClasses(transformed);
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
    fetchClasses();
  }, []);

  const handleUpdate = async (data: Partial<Class>) => {
    try {
      if (data.id) {
        await axios.put(`/class/${data.id}`, { name: data.name });
        toast.success("Class updated");
      } else {
        await axios.post("/class", { name: data.name });
        toast.success("Class added");
      }
      await fetchClasses();
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
      await axios.delete(`/class/${id}`);
      toast.success("Class deleted");
      await fetchClasses();
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };
  const handleStatusToggle = async (cls: Class) => {
      try {
        await axios.patch(`/class/${cls.id}`, {
          isActive: cls.status === "Active" ? false : true,
        });
        toast.success(
          `Class marked as ${
            cls.status === "Active" ? "Inactive" : "Active"
          }`
        );
        await fetchClasses(); // ✅ refetch to show updated state
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
      <ClassHeader onAdd={handleUpdate} />
      <Card className="p-6">
        <ClassTable
          classes={classes}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
            onStatusToggle={handleStatusToggle} // 🔥 NEW
        />
      </Card>
    </div>
  );
}
