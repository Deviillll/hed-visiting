"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleProtection } from "@/lib/auth-utils";
import { useBillStore, type Bill, type BillStatus } from "@/lib/stores/bill-store";
import { FileText, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function CreateBillDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const addBill = useBillStore(state => state.addBill);

  const handleSubmit = () => {
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newBill: Bill = {
      id: (Math.random() * 1000).toString(),
      name,
      startDate,
      endDate,
      status: "draft",
      createdBy: "Admin User"
    };
    
    addBill(newBill);
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
  const bills = useBillStore(state => state.bills);
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