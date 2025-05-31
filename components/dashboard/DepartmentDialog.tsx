"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export interface Department {
  id: number;
  name: string;
  code: string;
  hod: string;
  status: "Active" | "Inactive";
  avatar?: string;
    totalEmployees?: number;
}

interface Props {
  department?: Department;
  onSave: (data: Partial<Department>) => void;
  triggerType?: "button" | "icon";
}

export function DepartmentDialog({
  department,
  onSave,
  triggerType = "icon",
}: Props) {
  const [name, setName] = useState(department?.name || "");
  const [code, setCode] = useState(department?.code || "");
  const [hod, setHod] = useState(department?.hod || "");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!name || !code || !hod) {
      toast.error("All fields are required");
      return;
    }
    onSave({ id: department?.id, name, code, hod });
    setOpen(false);
    toast.success("Department saved");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerType === "icon" ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{department ? "Edit" : "Add"} Department</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hod">Head of Department</Label>
            <Input
              id="hod"
              value={hod}
              onChange={(e) => setHod(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
