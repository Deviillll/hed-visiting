

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

interface Class {
  _id: string;
  name: string;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
}

function ClassSelectComponent({ value, onChange }: Props) {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get("/class");
        setClasses(response.data);
      } catch (error) {
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="class">Class</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Class" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((cls) => (
            <SelectItem key={cls._id} value={cls._id}>
              {cls.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const ClassSelect = memo(ClassSelectComponent);
export default ClassSelect;
