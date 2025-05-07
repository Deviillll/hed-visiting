import { create } from 'zustand';

export type BillStatus = "draft" | "pending_level2" | "pending_principal" | "approved" | "rejected";

export interface Bill {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: BillStatus;
  createdBy: string;
  approvedBy?: string;
}

interface BillStore {
  bills: Bill[];
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
}

const initialBills: Bill[] = [
  {
    id: "1",
    name: "January 2025 Teaching Bill",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "draft",
    createdBy: "Admin User"
  },
  {
    id: "2",
    name: "December 2024 Teaching Bill",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "approved",
    createdBy: "Admin User",
    approvedBy: "Principal User"
  }
];

export const useBillStore = create<BillStore>((set) => ({
  bills: initialBills,
  addBill: (bill) => set((state) => ({ 
    bills: [...state.bills, bill] 
  })),
  updateBill: (id, updatedBill) => set((state) => ({
    bills: state.bills.map((bill) => 
      bill.id === id ? { ...bill, ...updatedBill } : bill
    )
  })),
  deleteBill: (id) => set((state) => ({
    bills: state.bills.filter((bill) => bill.id !== id)
  }))
}));