"use client";
import { useRoleProtection } from "@/lib/auth-utils";
import { type BillStatus } from "@/lib/stores/bill-store";
import { FileText, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import CreateBillDialog from "@/components/dashboard/BillDialog";
import BillTable from "@/components/dashboard/BillTable";

export interface Bill {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: BillStatus;
  createdBy: string;
  approvedBy?: string;
  isEditable: boolean;
}

export default function BillsPage() {
  const { isLoading } = useRoleProtection(["admin", "principal"]);
  // const bills = useBillStore((state) => state.bills);
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const res = await axiosInstance.get("/bill");
      const rawBills = res.data.data;

      const transformed = rawBills.map((d: any) => ({
        id: d._id,
        name: d.name,
        status: d.status,
        startDate: d.startDate,
        endDate: d.endDate,
        createdBy: d.createdBy.name,
        isEditable: d.isEditable,
      }));

      setBills(transformed);
    } catch (error) {
      toast.error("Failed to load bills");
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
        <CreateBillDialog onBillCreated={fetchBills} />
      </div>

      <BillTable bills={bills} />
    </div>
  );
}

