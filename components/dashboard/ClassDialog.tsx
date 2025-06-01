"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export interface Class {
  id: number | string;
  name: string;
  createdBy: { _id: string; name: string } | string;
    status?: "Active" | "Inactive";
}


interface Props {
  classItem?: Class;
  onSave: (data: Partial<Class>) => void;
  triggerType?: "button" | "icon";
}

export function ClassDialog({
  classItem,
  onSave,
  triggerType = "icon",
}: Props) {
  const [name, setName] = useState(classItem?.name || "");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }

    onSave({ id: classItem?.id, name });
    setOpen(false);
    toast.success("Class saved");
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
            Add Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classItem ? "Edit" : "Add"} Class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
