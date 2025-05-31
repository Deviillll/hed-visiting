// "use client";

// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { useRoleProtection } from "@/lib/auth-utils";
// import { Department } from "@/components/dashboard/DepartmentDialog";
// import { DepartmentPageHeader } from "@/components/dashboard/DepartmentHeader";
// import { DepartmentTable } from "@/components/dashboard/DepartmentTable";

// const initialDepartments: Department[] = [
// 	{ id: 1, name: "Computer Science", code: "CS", hod: "Dr. Alice", status: "Active" },
// 	{ id: 2, name: "Mathematics", code: "MATH", hod: "Dr. Bob", status: "Inactive" },
// ];

// export default function DepartmentsPage() {
// 	const { isLoading } = useRoleProtection(["superadmin", "admin", "principal"]);
// 	const [departments, setDepartments] = useState<Department[]>(initialDepartments);

// 	const handleUpdate = (data: Partial<Department>) => {
// 		if (data.id) {
// 			setDepartments((prev) => prev.map((d) => (d.id === data.id ? { ...d, ...data } : d)));
// 		} else {
// 			const newDept: Department = {
// 				id: Date.now(),
// 				name: data.name!,
// 				code: data.code!,
// 				hod: data.hod!,
// 				status: "Active",
// 			};
// 			setDepartments((prev) => [newDept, ...prev]);
// 		}
// 	};

// 	const toggleStatus = (dept: Department) => {
// 		setDepartments((prev) =>
// 			prev.map((d) =>
// 				d.id === dept.id ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } : d
// 			)
// 		);
// 	};

// 	if (isLoading) {
// 		return (
// 			<div className="flex h-full items-center justify-center">
// 				<Loader2 className="h-8 w-8 animate-spin text-primary" />
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="space-y-6">
// 			<DepartmentPageHeader onAdd={handleUpdate} />
// 			<Card className="p-6">
// 				<DepartmentTable
// 					departments={departments}
// 					onStatusToggle={toggleStatus}
// 					onUpdate={handleUpdate}
// 				/>
// 			</Card>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRoleProtection } from "@/lib/auth-utils";
import { Department } from "@/components/dashboard/DepartmentDialog";
import { DepartmentPageHeader } from "@/components/dashboard/DepartmentHeader";
import { DepartmentTable } from "@/components/dashboard/DepartmentTable";
import axios from "@/utils/axios"
import { toast } from "sonner";

export default function DepartmentsPage() {
  const { isLoading } = useRoleProtection(["superadmin", "admin", "principal"]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

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
	} catch (error) {
		toast.error("Failed to load departments");
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
	} catch (error) {
		toast.error("Failed to save department");
	}
};



  // ✅ Toggle department status
 const handleStatusToggle = async (dept: Department) => {
  try {
    await axios.patch(`/department/${dept.id}`, {
      isActive: dept.status === "Active" ? false : true,
    });
    toast.success(`Department marked as ${dept.status === "Active" ? "Inactive" : "Active"}`);
    await fetchDepartments(); // ✅ refetch to show updated state
  } catch (error) {
    toast.error("Failed to update status");
  }
};

const handleDelete = async (id: string) => {
	try {
		await axios.delete(`/department/${id}`);
		toast.success("Department deleted");
		await fetchDepartments(); // re-fetch the updated list
	} catch (error) {
		toast.error("Failed to delete department");
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
