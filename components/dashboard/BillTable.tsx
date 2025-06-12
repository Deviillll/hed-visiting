import React from 'react'
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BillStatus } from "@/lib/stores/bill-store";
import { Bill } from '@/app/dashboard/bills/page';
import { useRouter } from "next/navigation";
import { Card } from '../ui/card';

const BillTable = ({bills}:{bills: Bill[]}) => {
    const router=useRouter()
     const columns = [
        {
          key: "name" as const,
          title: "Bill Name",
        },
        {
          key: "startDate" as const,
          title: "Start Date",
          render: (value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }); // → "May 1, 2025"
          },
        },
        {
          key: "endDate" as const,
          title: "End Date",
          render: (value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }); // → "May 10, 2025"
          },
        },
        {
          key: "status" as const,
          title: "Status",
          render: (value: BillStatus) => {
            const statusStyles = {
              draft: "bg-slate-500",
              pending: "bg-amber-500",
              verification: "bg-purple-500",
              approved: "bg-green-500",
              fail: "bg-red-500",
              pass: "bg-green-500",
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => router.push(`/dashboard/bills/${bill.id}`)}
              >
                View Details
              </Button>
              {bill.isEditable === true && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/bills/${bill.id}?mode=edit`)
                  }
                >
                  Edit Details
                </Button>
              )}
            </div>
          ),
        },
      ];
  return (
     <Card className="p-4">
        <DataTable
          data={bills}
          columns={columns}
          searchField="name"
          itemsPerPage={5}
        />
      </Card>
  )
}

export default BillTable
