"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleProtection } from "@/lib/auth-utils";
import { useBillStore } from "@/lib/stores/bill-store";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Interface for Employee in bill details
interface Employee {
  id: string;
  name: string;
  personnelCode: string;
  interClasses?: number;
  bsClasses?: number;
}

export default function BillDetailsPage({ params }: { params: { id: string } }) {
  const { isLoading } = useRoleProtection(["admin"]);
  const router = useRouter();
  const bills = useBillStore(state => state.bills);
  const updateBill = useBillStore(state => state.updateBill);
  
  const bill = bills.find(b => b.id === params.id);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>(bill?.employees || []);
  const [searchText, setSearchText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock employees data for search
  const mockEmployees = [
    { id: "1", name: "John Smith", personnelCode: "EMP001" },
    { id: "2", name: "Sarah Johnson", personnelCode: "EMP002" },
    { id: "3", name: "Michael Brown", personnelCode: "EMP003" },
    { id: "4", name: "Emily Davis", personnelCode: "EMP004" },
    { id: "5", name: "David Wilson", personnelCode: "EMP005" }
  ];

  const handleAction = (action: "approve" | "reject") => {
    if (!bill) return;

    const newStatus = action === "approve" ? 
      (bill.status === "draft" ? "pending_level2" : 
       bill.status === "pending_level2" ? "pending_principal" : 
       "approved") : "rejected";

    updateBill(bill.id, { 
      status: newStatus,
      ...(newStatus === "approved" ? { approvedBy: "Principal User" } : {})
    });

    toast.success(`Bill ${action === "approve" ? "approved" : "rejected"} successfully`);
  };

  const filteredEmployees = mockEmployees.filter(emp => 
    !selectedEmployees.find(selected => selected.id === emp.id) &&
    (emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
     emp.personnelCode.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleAddEmployee = (employee: Employee) => {
    setSelectedEmployees(prev => [...prev, { ...employee, interClasses: 0, bsClasses: 0 }]);
    setIsDialogOpen(false);
    setSearchText("");
  };

  const handleUpdateRate = (employeeId: string, type: "inter" | "bs", value: number) => {
    setSelectedEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? { ...emp, [type === "inter" ? "interClasses" : "bsClasses"]: value }
          : emp
      )
    );
  };

  const handleSaveEmployees = () => {
    if (!bill) return;
    updateBill(bill.id, { employees: selectedEmployees });
    toast.success("Employees updated successfully");
  };

  if (isLoading) {
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
            <p className="text-lg font-medium">{bill.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="text-lg font-medium">{bill.endDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={
              bill.status === "draft" ? "bg-slate-500" :
              bill.status === "pending_level2" ? "bg-amber-500" :
              bill.status === "pending_principal" ? "bg-purple-500" :
              bill.status === "approved" ? "bg-green-500" :
              "bg-red-500"
            }>
              {bill.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created By</p>
            <p className="text-lg font-medium">{bill.createdBy}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Employees</h3>
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
                      placeholder="Search by name or personnel code"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredEmployees.map((employee) => (
                      <Button
                        key={employee.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleAddEmployee(employee)}
                      >
                        <span>{employee.name}</span>
                        <span className="ml-2 text-muted-foreground">
                          ({employee.personnelCode})
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {selectedEmployees.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.personnelCode}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`inter-${employee.id}`}>
                        Inter Classes
                      </Label>
                      <Input
                        id={`inter-${employee.id}`}
                        type="number"
                        value={employee.interClasses || 0}
                        onChange={(e) =>
                          handleUpdateRate(
                            employee.id,
                            "inter",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bs-${employee.id}`}>BS Classes</Label>
                      <Input
                        id={`bs-${employee.id}`}
                        type="number"
                        value={employee.bsClasses || 0}
                        onChange={(e) =>
                          handleUpdateRate(
                            employee.id,
                            "bs",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedEmployees.length > 0 && (
            <div className="flex justify-end gap-2">
              <Button onClick={handleSaveEmployees}>Save Changes</Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {bill.status !== "approved" && bill.status !== "rejected" && (
            <>
              <Button
                variant="outline"
                onClick={() => handleAction("reject")}
              >
                Reject
              </Button>
              <Button onClick={() => handleAction("approve")}>
                {bill.status === "pending_principal"
                  ? "Approve"
                  : "Send for Approval"}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}