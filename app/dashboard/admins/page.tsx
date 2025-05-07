"use client";

import { useRoleProtection } from "@/lib/auth-utils";
import { Loader2, UserCircle, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for admins
const admins = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "active",
    lastActive: "Today, 2:30 PM",
    avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    status: "active",
    lastActive: "Today, 11:20 AM",
    avatar: "https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    status: "inactive",
    lastActive: "Yesterday, 4:15 PM",
    avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "active",
    lastActive: "Today, 9:45 AM",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    status: "active",
    lastActive: "Today, 8:30 AM",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "6",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    status: "inactive",
    lastActive: "3 days ago",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    status: "active",
    lastActive: "Yesterday, 2:00 PM",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    status: "active",
    lastActive: "Today, 10:15 AM",
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
];

// Column definition for admin data table
const columns = [
  {
    key: "name" as const,
    title: "Name",
    render: (value: string, admin: typeof admins[0]) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={admin.avatar} alt={value} />
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
  {
    key: "lastActive" as const,
    title: "Last Active",
  },
];

export default function AdminsPage() {
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
          <Shield className="h-6 w-6 text-blue-500" />
          Admins
        </h2>
        <p className="text-muted-foreground">
          Manage admin users across your organization
        </p>
      </div>

      <Card className="p-6">
        <DataTable
          data={admins}
          columns={columns}
          searchField="name"
          itemsPerPage={5}
        />
      </Card>
    </div>
  );
}