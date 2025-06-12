"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleProtection } from "@/lib/auth-utils";
import { useBillStore } from "@/lib/stores/bill-store";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import BillEntryTable from "@/components/dashboard/BillEntryTable";

// Interface for Employee in bill details
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
interface Rate {
  rate: string;
  effectiveFrom: string;
}

interface Class {
  _id: string;
  name: string;
  latestRate: Rate;
  daysWorked: number;
}

interface User {
  name: string;
  email: string;
  userId: string;
}

interface EmployeeData {
  user: User;
  classes: Class[];
}

export default function BillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const { isLoading } = useRoleProtection(["admin", "principal"]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";
  //const updateBill = useBillStore((state) => state.updateBill);

  // State to store resolved bill ID
  const [billId, setBillId] = useState<string>("");

  useEffect(() => {
    // Access params.id safely
    if (id) {
      setBillId(id);
    }
  }, [params]);

  // State to store the bill details
  const [bill, setBill] = useState<any>(null);

  // Fetch the bill after billId is resolved
  useEffect(() => {
    const fetchBill = async () => {
      if (id) {
        try {
          const res = await axiosInstance.get(`/bill/${id}`);
          setBill(res.data);
        } catch (error) {
          console.error(error);
          setBill(undefined);
        }
      }
    };
    fetchBill();
  }, [id]);

  // Find the bill after billId is resolved
  //const bill = billId ? bills.find((b) => b.id === billId) : undefined;

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | null>(
    null
  );

  const getClassesOfTheEmployee = async (employee: Employee) => {
    try {
      const res = await axiosInstance.get(`/employee/classes/${employee.id}`);
      const rawClasses = res.data.classes || [];

      // Group all classes under a single employee object
      if (rawClasses.length > 0) {
        const { user } = rawClasses[0]; // All entries have the same user
        const transformed = {
          user,
          classes: rawClasses.map((cls: any) => ({
            _id: cls._id,
            name: cls.name,
            latestRate: cls.latestRate,
            daysWorked: 0, // Default value (editable in UI)
          })),
        };

        setCurrentEmployee(transformed);

        setIsDialogOpen(false);
        setSearchText("");
      } else {
        setCurrentEmployee(null);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setCurrentEmployee(null);
    }
  };

  const getaddedEmployees = async () => {
    if (!billId) return;
    try {
      const res = await axiosInstance.get(`/billEntry?billId=${billId}`);
      const rawEmployees = (await res.data.data) || [];

      setSelectedEmployees(rawEmployees);

      // console.log("Fetched added employees:", selectedEmployees);
    } catch (error) {
      console.error("Error fetching added employees:", error);
      setSelectedEmployees([]);
    }
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/employee");
      const rawEmployees = res.data;

      const transformed = rawEmployees.map((e: any) => ({
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
    } catch (error) {
      toast.error("Failed to load employees");
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  useEffect(() => {
    getaddedEmployees();
  }, [billId]);

  const filteredEmployees = useMemo(() => {
    const selectedEmployeeIds = new Set(
      selectedEmployees.map((s: any) => s.employee._id)
    );
    return employees.filter(
      (emp) =>
        !selectedEmployeeIds.has(emp.id) &&
        (emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [employees, selectedEmployees, searchText]);

  const handleSaveEmployee = async (emp: EmployeeData) => {
    try {
      console.log(emp);
      const res = await axiosInstance.post(`/billEntry?billId=${billId}`, {
        data: emp,
      });
      if (res.status === 201) {
        toast.success("Employee saved successfully");
        setCurrentEmployee(null); // Clear current employee after saving
        getaddedEmployees(); // Refresh the list of added employees
      } else {
        toast.error("Failed to save employee data");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee data");
    }
  };

  const handleUpdateRate = (
    userEmail: string,
    classId: string,
    value: number
  ) => {
    setCurrentEmployee((prev) => {
      if (!prev || prev.user.email !== userEmail) return prev;

      return {
        ...prev,
        classes: prev.classes.map((cls: any) => {
          if (cls._id !== classId) return cls;
          return {
            ...cls,
            daysWorked: value,
          };
        }),
      };
    });

    console.log(currentEmployee);
  };

  // Loading state while resolving params
  if (isLoading || !bill) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Bill not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" />
          {bill.name}
        </h2>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="text-lg font-medium">
              {new Date(bill.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="text-lg font-medium">
              {new Date(bill.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              className={
                bill.status === "draft"
                  ? "bg-slate-500"
                  : bill.status === "pending"
                  ? "bg-amber-500"
                  : bill.status === "approved"
                  ? "bg-green-500"
                  : bill.status === "pass"
                  ? "bg-blue-500"
                  : bill.status === "fail"
                  ? "bg-red-500"
                  : bill.status === "verification"
                  ? "bg-purple-500"
                  : "bg-gray-500"
              }
            >
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created By</p>
            <p className="text-lg font-medium">{bill.createdBy.name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Employees</h3>
            {isEditMode && bill.status === "draft" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add Employee</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search Employees</Label>
                      <Input
                        id="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name or email"
                      />
                    </div>
                    <div className="space-y-2">
                      {filteredEmployees.map((employee) => (
                        <Button
                          key={employee.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => getClassesOfTheEmployee(employee)}
                        >
                          <span>{employee.name}</span>
                          <span className="ml-2 text-muted-foreground">
                            ({employee.departmentCode})
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            - {employee.email}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {currentEmployee && (
              <Card key={currentEmployee.user.email} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left side: user info */}
                  <div>
                    <p className="font-medium">{currentEmployee.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentEmployee.user.email}
                    </p>
                  </div>

                  {/* Right side: dynamic classes */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentEmployee.classes.map((cls: any) => (
                      <div key={cls._id}>
                        <Label
                          htmlFor={`class-${currentEmployee.user.email}-${cls._id}`}
                        >
                          {cls.name} Classes
                        </Label>
                        {isEditMode && bill.status === "draft" ? (
                          <>
                            <Input
                              id={`class-${currentEmployee.user.email}-${cls._id}`}
                              type="number"
                              value={cls.daysWorked === 0 ? "" : cls.daysWorked}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const parsedValue = parseInt(inputValue);
                                handleUpdateRate(
                                  currentEmployee.user.email,
                                  cls._id,
                                  isNaN(parsedValue) ? 0 : parsedValue
                                );
                              }}
                            />
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            Days Worked: {cls.daysWorked}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditMode && bill.status === "draft" && (
                    <div className="col-span-2 flex justify-end mt-4">
                      <Button
                        onClick={() => handleSaveEmployee(currentEmployee)}
                      >
                        Save Employee Data
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
      <BillEntryTable entries={selectedEmployees} onDeleteSuccess={getaddedEmployees} />
    </div>
  );
}
