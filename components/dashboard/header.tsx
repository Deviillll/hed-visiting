"use client";

import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { BellIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardNav } from "@/components/dashboard/nav";
import { motion } from "framer-motion";

// Role-specific colors and titles
const roleConfigs: Record<UserRole, { color: string; title: string }> = {
  superadmin: { 
    color: "bg-purple-500 dark:bg-purple-700",
    title: "Super Admin Dashboard" 
  },
  admin: { 
    color: "bg-blue-500 dark:bg-blue-700", 
    title: "Admin Dashboard" 
  },
  principal: { 
    color: "bg-green-500 dark:bg-green-700", 
    title: "Principal Dashboard" 
  },
  employee: { 
    color: "bg-amber-500 dark:bg-amber-700", 
    title: "Employee Dashboard" 
  },
};

export function DashboardHeader() {
  const { user } = useAuth();
   if (!user) return null;

  if (!user.role) return null;
  const { color, title } = roleConfigs[user.role];



  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <DashboardNav />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`h-3 w-3 rounded-full ${color}`} 
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}