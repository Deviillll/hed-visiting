"use client";

import { useRoleProtection } from "@/lib/auth-utils";
import { Loader2, UserCircle, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for principals
const principals = [
  {
    id: "1",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    department: "Engineering",
    status: "active",
    employees: 24,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "2",
    name: "Emma Williams",
    email: "emma.williams@example.com",
    department: "Marketing",
    status: "active",
    employees: 18,
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "3",
    name: "James Brown",
    email: "james.brown@example.com",
    department: "Finance",
    status: "active",
    employees: 15,
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "4",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    department: "Human Resources",
    status: "inactive",
    employees: 12,
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "5",
    name: "William Wilson",
    email: "william.wilson@example.com",
    department: "Product",
    status: "active",
    employees: 22,
    avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "6",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    department: "Customer Support",
    status: "active",
    employees: 30,
    avatar: "https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
];

// Column definition for principal data table
const columns = [
  {
    key: "name" as const,
    title: "Name",
    render: (value: string, principal: typeof principals[0]) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={principal.avatar} alt={value} />
          <AvatarFallback>
            <UserCircle className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: "email" as const,
    title: "Email",
  },
  {
    key: "department" as const,
    title: "Department",
    render: (value: string) => (
      <span className="font-medium">{value}</span>
    ),
  },
  {
    key: "employees" as const,
    title: "Employees",
    render: (value: number) => (
      <Badge variant="outline" className="font-medium">
        {value}
      </Badge>
    ),
  },
  {
    key: "status" as const,
    title: "Status",
    render: (value: string) => (
      <Badge
        variant={value === "active" ? "default" : "secondary"}
        className={
          value === "active" ? "bg-green-500" : "bg-slate-400"
        }
      >
        {value}
      </Badge>
    ),
  },
];

export default function PrincipalsPage() {
  // Only allow superadmin to access this page
  const { isLoading } = useRoleProtection(["superadmin"]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-green-500" />
          Principals
        </h2>
        <p className="text-muted-foreground">
          Manage principal users and their departments
        </p>
      </div>

      <Card className="p-6">
        <DataTable
          data={principals}
          columns={columns}
          searchField="name"
          itemsPerPage={5}
        />
      </Card>
    </div>
  );
}