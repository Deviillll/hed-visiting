"use client";

import { InstituteForm } from "@/components/Institute-form";
import { useRoleProtection } from "@/lib/auth-utils";
import { Loader2, UserCircle, Shield } from "lucide-react";


// Mock data for admins


// Column definition for admin data table

export default function organizationPage() {
  // Only allow superadmin to access this page
  const { isLoading } = useRoleProtection(["principal"]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="">
        <InstituteForm />
 
    </div>
  );
}