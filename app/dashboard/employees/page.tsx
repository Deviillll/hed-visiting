
"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AddEmployee } from "@/components/dashboard/AddEmployees";
import { DataTable } from "@/components/dashboard/data-table";
import { EmployeePageHeader } from "@/components/dashboard/EmployeeHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import axios from "@/utils/axios";
import { toast } from "sonner";



interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentCode: string;
  department: string;
  position: string;
  status: "active" | "inactive";
  rates: {
	_id?: string;
	classId: string;
	rate: number;
	effectiveFrom?: Date;
  }[];
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/employee");
      const rawEmployees = res.data;

      const transformed = rawEmployees.map((e:any) => ({
        id: e._id,
        name: e.name,
        email: e.email,
        departmentId: e.department._id,
        departmentCode: e.department.code,
		department: e.department.name,
        position: e.position,
        status: e.status,
        rates: e.rates || [],
      }));

      setEmployees(transformed);
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSaveEmployee = async (employeeData:any) => {
    try {
		if (employeeData.id) {
		  console.log(employeeData)
        await axios.put(`/employee/${employeeData.id}`, employeeData);
        toast.success("Employee updated");
      } else {
        await axios.post("/employee", employeeData);
        toast.success("Employee created");
      }
      fetchEmployees();
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const handleDeleteEmployee = async (employee:Employee) => {
    try {
		if (confirm(`Are you sure you want to delete "${employee.name}"?`)){
      await axios.delete(`/employee/${employee.id}`);
      toast.success("Employee deleted");
      fetchEmployees();
		}
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const handleStatusToggle = async (id:string, currentStatus:string) => {
    try {
		console.log(`Toggling status for employee ${id} from ${currentStatus}`);
      await axios.patch(`/employee/${id}`, {
        isActive: currentStatus === "active" ? "inactive" : "active",
      });
      toast.success("Employee status updated");
      fetchEmployees();
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (value:string, employee:Employee) => (
        <div className="flex items-center gap-2">
          {/* <Avatar className="h-8 w-8">
            <AvatarImage src={employee.avatar} alt={value} />
            <AvatarFallback>{value[0]}</AvatarFallback>
          </Avatar> */}
          <span>{value}</span>
        </div>
      ),
    },
    { key: "email", title: "Email" },
    { key: "department", title: "Department" },
    { key: "position", title: "Position" },
    {
      key: "status",
      title: "Status",
      render: (value:string, employee:Employee) => (

        <Badge
          variant={value === "active" ? "default" : "secondary"}
          className={`${
            value === "active" ? "bg-green-500" : "bg-slate-400"
          } cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={() => handleStatusToggle(employee.id, value)}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_:any, employee:any) => (
        <div className="flex items-center gap-2">
          <AddEmployee
            triggerType="icon"
            admin={employee}
            onSave={handleSaveEmployee}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100"
            onClick={() => handleDeleteEmployee(employee)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeePageHeader onAdd={handleSaveEmployee} />
      <Card className="p-6">
        <DataTable
          data={employees}
		  //@ts-ignore
          columns={columns}
          searchField="name"
          itemsPerPage={5}
        />
      </Card>
    </div>
  );
}
