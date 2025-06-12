"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface BillEntry {
  _id: string;
  rate: number;
  workDays: number;
  amount: number;
  isVerified: boolean;
  createdAt: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  class: {
    _id: string;
    name: string;
  };
  updateRate?: boolean; // Optional field for updating rate
}

interface Props {
  billEntry: BillEntry;
  onSave: (data: Partial<BillEntry>) => Promise<void>;
}

export function BillEntryDialog({ billEntry, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [workDays, setWorkDays] = useState(billEntry.workDays);
  const [updateRate, setUpdateRate] = useState(false);

  // Reset workDays when billEntry changes or dialog reopens
  useEffect(() => {
    setWorkDays(billEntry.workDays);
    setUpdateRate(false); // Reset updateRate checkbox
  }, [billEntry, open]);

  const handleSave = async () => {
    if (workDays < 0) {
      toast.error("Work days cannot be negative");
      return;
    }

    try {
      await onSave({ workDays, updateRate });
      toast.success("Bill entry updated");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update bill entry");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4 cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Edit Bill Entry`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-center">
            <h3 className="font-semibold">Name</h3>
            <p>{billEntry.employee.name}</p>

            <h3 className="font-semibold">Email</h3>
            <p>{billEntry.employee.email}</p>

            <h3 className="font-semibold">Class</h3>
            <p>{billEntry.class.name}</p>
            <h3 className="font-semibold">Rate</h3>
            <p>{billEntry.rate}</p>
  
            

            <h3 className="font-semibold">Work Days</h3>
            <Input
              id="workDays"
              type="number"
              min={0}
              value={workDays}
              onChange={(e) => setWorkDays(Number(e.target.value))}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updateRate}
                onChange={() => setUpdateRate(!updateRate)}
              />
              Update Latest Rate
            </label>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
