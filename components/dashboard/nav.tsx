"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle, Home, Users, Building2, Briefcase, Settings, LogOut, FileText,Grid  } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Navigation items based on user role
const getNavItems = (role: string) => {
  const items = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["superadmin", "admin", "principal", "employee"],
    },
  ];

  // Admins page for superadmin and principal
  if (["superadmin", "principal"].includes(role)) {
    items.push({
      name: "Admins",
      href: "/dashboard/admins",
      icon: Users,
      roles: ["superadmin", "principal"],
    });
  }

  // Principals page only for superadmin
  if (role === "superadmin") {
    items.push({
      name: "Principals",
      href: "/dashboard/principals",
      icon: Building2,
      roles: ["superadmin"],
    });
  }

  // Employees and Bills page for superadmin, admin, and principal
  if (["superadmin", "admin", "principal"].includes(role)) {
    items.push(
      {
        name: "Employees",
        href: "/dashboard/employees",
        icon: Briefcase,
        roles: ["superadmin", "admin", "principal"],
      },
      {
        name: "Bills",
        href: "/dashboard/bills",
        icon: FileText,
        roles: ["superadmin", "admin", "principal"],
      },
      {
        name: "Departments",
        href: "/dashboard/departments",
        icon: Grid,
        roles: ["superadmin", "admin", "principal"],
      }
    );
  }

  // Organization page only for principal
  if (role === "principal") {
    items.push({
      name: "Organization",
      href: "/dashboard/organization",
      icon: Building2,
      roles: ["principal"],
    });
  }

  // Settings for all roles
  items.push({
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["superadmin", "admin", "principal", "employee"],
  });

  return items.filter((item) => item.roles.includes(role));
};


export function DashboardNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <div className="flex flex-col h-full p-4 border-r bg-card">
      <div className="flex items-center gap-2 py-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <UserCircle className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={cn(
                  "w-full justify-start", 
                  isActive ? "font-medium" : "font-normal"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
                {isActive && (
                  <motion.div
                    className="absolute right-0 w-1 h-8 bg-primary rounded-l-md"
                    layoutId="nav-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                  />
                )}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}