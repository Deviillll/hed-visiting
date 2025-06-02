"use client";
import { memo, useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

interface Department {
  _id: string;
  name: string;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
}

function DepartmentSelectComponent({ value, onChange }: Props) {
  console.log("Rendering DepartmentSelect");
  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("/department");
        setDepartments(response.data);
      } catch (error) {
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="department">Department</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept._id} value={dept._id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const DepartmentSelect = memo(DepartmentSelectComponent);

export default DepartmentSelect;
