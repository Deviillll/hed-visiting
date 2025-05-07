"use client";

import { useRoleProtection } from "@/lib/auth-utils";
import { Loader2, FileText, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Bill status types
type BillStatus = "draft" | "pending_level2" | "pending_principal" | "approved" | "rejected";

interface Bill {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: BillStatus;
  createdBy: string;
  approvedBy?: string;
}

// Mock data for bills
const initialBills: Bill[] = [
  {
    id: "1",
    name: "January 2025 Teaching Bill",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "draft",
    createdBy: "Admin User"
  },
  {
    id: "2",
    name: "December 2024 Teaching Bill",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "approved",
    createdBy: "Admin User",
    approvedBy: "Principal User"
  }
];

function CreateBillDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = () => {
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real app, this would make an API call
    const newBill: Bill = {
      id: (Math.random() * 1000).toString(),
      name,
      startDate,
      endDate,
      status: "draft",
      createdBy: "Admin User"
    };
    // it should be updating the state of bill in BillsPage
    
    
    

    

    toast.success("Bill created successfully");
    setOpen(false);
    setName("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Bill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter bill name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create Bill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BillsPage() {
  const { isLoading } = useRoleProtection(["admin"]);
  const [bills] = useState<Bill[]>(initialBills);
  const router = useRouter();

  const columns = [
    {
      key: "name" as const,
      title: "Bill Name",
    },
    {
      key: "startDate" as const,
      title: "Start Date",
    },
    {
      key: "endDate" as const,
      title: "End Date",
    },
    {
      key: "status" as const,
      title: "Status",
      render: (value: BillStatus) => {
        const statusStyles = {
          draft: "bg-slate-500",
          pending_level2: "bg-amber-500",
          pending_principal: "bg-purple-500",
          approved: "bg-green-500",
          rejected: "bg-red-500",
        };

        return (
          <Badge className={statusStyles[value]}>
            {value.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    },
    {
      key: "actions" as const,
      title: "",
      render: (_: any, bill: Bill) => (
        <Button variant="ghost" onClick={() => router.push(`/dashboard/bills/${bill.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" />
          Bills
        </h2>
        <p className="text-muted-foreground">
          Manage and process teaching bills
        </p>
      </div>

      <div className="flex justify-end">
        <CreateBillDialog />
      </div>

      <Card className="p-6">
        <DataTable
          data={bills}
          columns={columns}
          searchField="name"
          itemsPerPage={40}
        />
      </Card>
    </div>
  );
}