"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { motion } from "framer-motion";
import { Users, Building2, Briefcase, LineChart, BarChart2, PieChart, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";


// Mock activity data
const recentActivities = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    action: "Created a new admin account",
    timestamp: "2 hours ago",
    category: "create" as const,
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    action: "Updated employee profile information",
    timestamp: "4 hours ago",
    category: "update" as const,
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    action: "Deleted inactive user account",
    timestamp: "Yesterday",
    category: "delete" as const,
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    action: "Logged in from a new device",
    timestamp: "Yesterday",
    category: "login" as const,
  },
];

// Role-specific dashboard stats
const getDashboardStats = (role: UserRole) => {
  const statsMap = {
    superadmin: [
      {
        title: "Total Admins",
        value: "8",
        icon: <Users className="h-4 w-4 text-blue-500" />,
        trend: "up" as const,
        trendValue: "2 this month",
      },
      {
        title: "Total Principals",
        value: "24",
        icon: <Building2 className="h-4 w-4 text-green-500" />,
        trend: "up" as const,
        trendValue: "5 this month",
      },
      {
        title: "Total Employees",
        value: "286",
        icon: <Briefcase className="h-4 w-4 text-amber-500" />,
        trend: "up" as const,
        trendValue: "32 this month",
      },
      {
        title: "Active Users",
        value: "214",
        icon: <LineChart className="h-4 w-4 text-purple-500" />,
        description: "Currently online",
        trend: "neutral" as const,
        trendValue: "Same as yesterday",
      },
    ],
    admin: [
      {
        title: "Total Employees",
        value: "124",
        icon: <Briefcase className="h-4 w-4 text-amber-500" />,
        trend: "up" as const,
        trendValue: "12 this month",
      },
      {
        title: "Active Employees",
        value: "98",
        icon: <LineChart className="h-4 w-4 text-green-500" />,
        description: "78% of total employees",
        trend: "up" as const,
        trendValue: "5% more than last month",
      },
      {
        title: "Departments",
        value: "8",
        icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
        trend: "neutral" as const,
        trendValue: "No change",
      },
      {
        title: "Average Time",
        value: "6.4h",
        icon: <Clock className="h-4 w-4 text-purple-500" />,
        description: "Daily work time",
        trend: "up" as const,
        trendValue: "0.3h from last week",
      },
    ],
    principal: [
      {
        title: "Total Employees",
        value: "56",
        icon: <Briefcase className="h-4 w-4 text-amber-500" />,
        trend: "up" as const,
        trendValue: "3 this month",
      },
      {
        title: "Departments",
        value: "4",
        icon: <PieChart className="h-4 w-4 text-green-500" />,
        trend: "neutral" as const,
        trendValue: "No change",
      },
      {
        title: "Projects",
        value: "12",
        icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
        trend: "up" as const,
        trendValue: "2 this month",
      },
      {
        title: "Completion Rate",
        value: "87%",
        icon: <LineChart className="h-4 w-4 text-purple-500" />,
        description: "Project completion",
        trend: "up" as const,
        trendValue: "5% from last month",
      },
    ],
    employee: [
      {
        title: "Active Tasks",
        value: "8",
        icon: <Briefcase className="h-4 w-4 text-amber-500" />,
        trend: "down" as const,
        trendValue: "2 completed yesterday",
      },
      {
        title: "Team Members",
        value: "12",
        icon: <Users className="h-4 w-4 text-green-500" />,
        trend: "neutral" as const,
        trendValue: "No change",
      },
      {
        title: "Projects",
        value: "3",
        icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
        trend: "neutral" as const,
        trendValue: "No change",
      },
      {
        title: "Average Time",
        value: "7.2h",
        icon: <Clock className="h-4 w-4 text-purple-500" />,
        description: "Daily work time",
        trend: "up" as const,
        trendValue: "0.5h from last week",
      },
    ],
  };

  return statsMap[role] || [];
};

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    return user ? getDashboardStats(user.role) : [];
  }, [user]);

  if (!user) return null;

  const greetings = [
    "Good morning",
    "Good afternoon",
    "Good evening",
  ][Math.floor(new Date().getHours() / 8)];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">
          {greetings}, {user.name}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your dashboard
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            // trend={stat.trend}
            // trendValue={stat.trendValue}
            delay={i}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions from you and your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Activity List */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              Quick guide to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-2"
              >
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Manage Your Team</h4>
                  <p className="text-muted-foreground">
                    View and manage team members based on your role permissions.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Track Performance</h4>
                  <p className="text-muted-foreground">
                    Monitor team performance with detailed analytics.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start gap-2"
              >
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Department Oversight</h4>
                  <p className="text-muted-foreground">
                    Manage organization structure and department assignments.
                  </p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}