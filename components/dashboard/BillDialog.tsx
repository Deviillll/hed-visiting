"use client";
import axiosInstance from "@/utils/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";





function CreateBillDialog({ onBillCreated }: { onBillCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");


  const handleSubmit = async () => {
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newBill = {
      name,
      startDate,
      endDate,
      paymentMode,
    };
    const res = await axiosInstance.post("/bill", newBill);

    if (res.status === 201) {
    
      toast.success("Bill created successfully");
      setOpen(false);
      setName("");
      setStartDate("");
      setEndDate("");
      setPaymentMode("");
      onBillCreated?.();
    } else {
      toast.error("Failed to create bill");
    }
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
        <div className="space-y-5 lg:space-y-10 py-4">
          <div className="grid lg:grid-cols-2 gap-4 items-center">
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
              <Label htmlFor="duration">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4 items-center">
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
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Create Bill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default CreateBillDialog;
