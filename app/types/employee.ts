export interface Employee {
  id: string;
  name: string;
  fatherName: string;
  bankAccountNumber: string;
  cnic: string;
  personnelNumber: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  isActive: boolean;
  interRate: number;
  bsClassRate: number;
}

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "fatherName",
    header: "Father Name",
  },
  {
    accessorKey: "cnic",
    header: "CNIC",
  },
  {
    accessorKey: "personnelNumber",
    header: "Personnel Number",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: any) => (
      <div className="capitalize">
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    accessorKey: "interRate",
    header: "Inter Rate",
  },
  {
    accessorKey: "bsClassRate",
    header: "BS Class Rate",
  },
]; 