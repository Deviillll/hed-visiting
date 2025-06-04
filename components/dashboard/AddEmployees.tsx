

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClassSelect from "./ClassSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DepartmentSelect from "./DepartmentSelect";

export interface Admin {
  id: string;
  name: string;
  email: string;
  status?: "Active" | "Inactive";
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
  position?: string;
  rates?: { classId: string; rate: number; _id: string }[];
}

interface Props {
  admin?: Partial<Admin>;
  onSave: (data: Partial<Admin> & { password?: string }) => void;
  triggerType?: "button" | "icon";
}

export function AddEmployee({ admin, onSave, triggerType = "icon" }: Props) {
  const [classRates, setClassRates] = useState<{ classId: string; rate: string ,_id:string}[]>([]);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialState = useMemo(
    () => ({
      name: admin?.name || "",
      email: admin?.email || "",
      password: "",
      departmentId: admin?.departmentId || "",
      position: admin?.position || "",
    }),
    [admin]
  );

  const [form, setForm] = useState(initialState);

  // ✅ Handle form & classRates when dialog opens
  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setClassRates([]);
    } else {
      setForm(initialState);

      if (admin?.rates?.length) {
        setClassRates(
          admin.rates.map((r) => ({
            classId: r.classId,
            rate: String(r.rate),
            _id: r._id,
          }))
        );
      }
    }
  }, [open, initialState, admin]);

  const handleInputChange = useCallback(
    (key: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleAddRate = () => {
    setClassRates((prev) => [...prev, { classId: "", rate: "", _id: "" }]);
  };

  const handleRateChange = (
    index: number,
    field: "classId" | "rate",
    value: string
  ) => {
    const updated = [...classRates];
    updated[index][field] = value;
    setClassRates(updated);
  };

  const handleRemoveRate = (index: number) => {
    setClassRates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = useCallback(() => {
    if (isSaving) return;

    const { name, email, password, departmentId, position } = form;

    if (!name || !email || (!admin && !password) || !departmentId || !position) {
      toast.error("All fields are required");
      return;
    }

    if (classRates.some((rate) => !rate.classId || !rate.rate)) {
      toast.error("Please fill out all class rates");
      return;
    }

    setIsSaving(true);

    onSave({
      id: admin?.id,
      name,
      email,
      ...(password && { password }),
      departmentId,
      position,
      rates: classRates.map(({ classId, rate ,_id}) => ({
        classId,
        rate: parseFloat(rate),
        _id ,
      })),
    });

    setOpen(false);

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  }, [form, isSaving, onSave, admin, classRates]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerType === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={admin ? "Edit Employee" : "Add Employee"}
          >
            {admin ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{admin ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <DepartmentSelect
                value={form.departmentId}
                onChange={(id) => handleInputChange("departmentId", id)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {!admin && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={form.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>

          <div className="space-y-1">
            <Label>Rates</Label>
            {classRates.map((rateEntry, index) => (
              <div key={index} className="flex items-center gap-4">
                <ClassSelect
                  value={rateEntry.classId}
                  onChange={(id) => handleRateChange(index, "classId", id)}
                />
                <div className="w-full">
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    value={rateEntry.rate}
                    onChange={(e) =>
                      handleRateChange(index, "rate", e.target.value)
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveRate(index)}
                  type="button"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddRate} type="button">
              Add Rate
            </Button>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isSaving}>
            {admin ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
