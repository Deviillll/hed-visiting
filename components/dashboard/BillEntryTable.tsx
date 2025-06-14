import React from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { BillEntryDialog } from "./BillEntryDialog";

type BillEntry = {
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
};

const BillEntryTable = ({
  entries,
  onDeleteSuccess,
}: {
  entries: BillEntry[];
  onDeleteSuccess: () => void;
}) => {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    // first confirm the deletion
    if (!confirm(`Are you sure you want to delete ${name} bill entry?`)) {
        return;
        }
    try {
        const res=await axiosInstance.delete(`/billEntry/${id}`);
      if (res.status === 200) {
        // Optionally, you can show a success message or update the UI
        toast.success("Bill entry deleted successfully");
        onDeleteSuccess();
      }
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
  };
  const handleUpdate = async (id: string, updatedData: Partial<BillEntry>, currentEntry: BillEntry) => {
  try {
     const res= await axiosInstance.put(`/billEntry/${id}`, {
      ...currentEntry,
      ...updatedData,
      isVerified: currentEntry.isVerified, // keep as is
    });
   if(res.status === 200) {
      toast.success("Bill entry updated successfully");
      onDeleteSuccess(); // Refresh the page to reflect changes
    }
    // Optionally refresh data or call a refresh function here
  } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Please try again later",
        position: "top-right",
        duration: 2000,
      });
    }
};
const handleToggleVerified = async (billId: string, currentStatus: boolean) => {
  try {
    const res= await axiosInstance.patch(`/billEntry/${billId}`, { isVerified: !currentStatus });

    if(res.status === 200) {
      toast.success(`Bill entry ${!currentStatus ? "verified" : "unverified"} successfully`);
      onDeleteSuccess(); // Refresh the page to reflect changes
    }
  } catch (error: any) {
        toast.error("An error occurred", {
          description: error.response?.data?.message || "Please try again later",
          position: "top-right",
          duration: 2000,
        });
      }
};



  // Transform the data for search and easy column access
  const transformedEntries = entries.map((entry) => ({
    ...entry,
    name: entry.employee.name,
    email: entry.employee.email,
    className: entry.class.name,
  }));

  const columns = [
    {
      key: "name" as const,
      title: "Name",
      render: (_: any, row: BillEntry) => row.employee.name,
    },
    {
      key: "email" as const,
      title: "Email",
      render: (_: any, row: BillEntry) => row.employee.email,
    },
    {
      key: "className" as const,
      title: "Class",
      render: (_: any, row: BillEntry) => row.class.name,
    },
    {
      key: "workDays" as const,
      title: "Work Days",
      render: (value: any, row: BillEntry) => row.workDays,
    },
    {
      key: "isVerified" as const,
      title: "Verified",
      render: (value: any, row: BillEntry) => (
        <Badge
        onClick={() => handleToggleVerified(row._id, row.isVerified)} 
         className={row.isVerified ? "bg-green-600 cursor-pointer" : "bg-red-500 cursor-pointer"}>
          {row.isVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
    key: "actions" as const,
    title: "Action",
    render: (_: any, row: BillEntry) => (
      <div className="flex items-center gap-2">
        <BillEntryDialog
          billEntry={row}
           onSave={(updatedData) => handleUpdate(row._id, updatedData, row)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row._id, row.employee.name)}
          className="text-red-500 hover:bg-red-100 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  ];

  return (
    <Card className="p-4">
      <DataTable
        data={transformedEntries}
        columns={columns}
        searchField="name"
        itemsPerPage={5}
      />
    </Card>
  );
};

export default BillEntryTable;
