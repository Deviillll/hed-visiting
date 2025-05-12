"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useBillStore } from "@/lib/stores/bill-store";
import { useUserStore } from "@/lib/stores/user-store";
import { UserRole } from "@/lib/types";
import { motion } from "framer-motion";
import {
	BarChart2,
	Briefcase,
	Building2,
	CalendarCheck,
	FileText,
	LineChart,
	PieChart,
	Users,
} from "lucide-react";
import { useMemo } from "react";

// Function to calculate dashboard stats based on data and role
const calculateDashboardStats = (
	role: UserRole,
	allUsers: any[],
	bills: any[]
) => {
	// Calculate dynamic user statistics
	const totalAdmins = allUsers.filter((user) => user.role === "admin").length;
	const activeAdmins = allUsers.filter(
		(user) => user.role === "admin" && user.status === "active"
	).length;

	const totalPrincipals = allUsers.filter(
		(user) => user.role === "principal"
	).length;
	const activePrincipals = allUsers.filter(
		(user) => user.role === "principal" && user.status === "active"
	).length;

	const totalEmployees = allUsers.filter(
		(user) => user.role === "employee"
	).length;
	const activeEmployees = allUsers.filter(
		(user) => user.role === "employee" && user.status === "active"
	).length;

	const totalUsers = allUsers.length;
	const activeUsers = allUsers.filter(
		(user) => user.status === "active"
	).length;

	// Get unique departments
	const departments = Array.from(
		new Set(
			allUsers
				.filter((user) => "department" in user && user.department)
				.map((user) => (user as any).department)
		)
	);

	// Calculate bill statistics
	const draftBills = bills.filter((bill) => bill.status === "draft").length;
	const pendingBills = bills.filter((bill) =>
		bill.status.includes("pending")
	).length;
	const approvedBills = bills.filter(
		(bill) => bill.status === "approved"
	).length;
	const rejectedBills = bills.filter(
		(bill) => bill.status === "rejected"
	).length;
	const nonApprovedBills = bills.filter(
		(bill) => bill.status !== "approved"
	).length;

	const statsMap = {
		superadmin: [
			{
				title: "Total Admins",
				value: totalAdmins.toString(),
				icon: <Users className="h-4 w-4 text-blue-500" />,
				description: `${activeAdmins} active admins`,
			},
			{
				title: "Total Principals",
				value: totalPrincipals.toString(),
				icon: <Building2 className="h-4 w-4 text-green-500" />,
				description: `${activePrincipals} active principals`,
			},
			{
				title: "Total Employees",
				value: totalEmployees.toString(),
				icon: <Briefcase className="h-4 w-4 text-amber-500" />,
				description: `${activeEmployees} active employees`,
			},
			{
				title: "Active Users",
				value: activeUsers.toString(),
				icon: <LineChart className="h-4 w-4 text-purple-500" />,
				description: `${Math.round(
					(activeUsers / totalUsers) * 100
				)}% of total users`,
			},
		],
		admin: [
			{
				title: "Total Employees",
				value: totalEmployees.toString(),
				icon: <Briefcase className="h-4 w-4 text-amber-500" />,
				description: `${Math.round(
					(activeEmployees / totalEmployees) * 100
				)}% active employees`,
			},
			{
				title: "Active Employees",
				value: activeEmployees.toString(),
				icon: <LineChart className="h-4 w-4 text-green-500" />,
				description: `${totalEmployees - activeEmployees} inactive employees`,
			},
			{
				title: "Departments",
				value: departments.length.toString(),
				icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
				description: "Total departments",
			},
			{
				title: "Bills",
				value: bills.length.toString(),
				icon: <FileText className="h-4 w-4 text-purple-500" />,
				description: `${nonApprovedBills} pending/draft/rejected bills`,
			},
		],
		principal: [
			{
				title: "Total Employees",
				value: totalEmployees.toString(),
				icon: <Briefcase className="h-4 w-4 text-amber-500" />,
				description: `${activeEmployees} active employees`,
			},
			{
				title: "Departments",
				value: departments.length.toString(),
				icon: <PieChart className="h-4 w-4 text-green-500" />,
				description: "Total departments",
			},
			{
				title: "Pending Bills",
				value: pendingBills.toString(),
				icon: <CalendarCheck className="h-4 w-4 text-blue-500" />,
				description: `${draftBills} drafts, ${rejectedBills} rejected`,
			},
			{
				title: "Approved Bills",
				value: approvedBills.toString(),
				icon: <FileText className="h-4 w-4 text-purple-500" />,
				description: `${nonApprovedBills} non-approved bills`,
			},
		],
		employee: [
			{
				title: "Active Employees",
				value: activeEmployees.toString(),
				icon: <Briefcase className="h-4 w-4 text-amber-500" />,
				description: `Out of ${totalEmployees} total employees`,
			},
			{
				title: "Team Members",
				value: Math.floor(totalEmployees / departments.length).toString(),
				icon: <Users className="h-4 w-4 text-green-500" />,
				description: "Average per department",
			},
			{
				title: "Departments",
				value: departments.length.toString(),
				icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
				description: "Total departments",
			},
			{
				title: "Bills",
				value: bills.length.toString(),
				icon: <FileText className="h-4 w-4 text-purple-500" />,
				description: `${nonApprovedBills} non-approved bills`,
			},
		],
	};

	return statsMap[role] || [];
};

export default function DashboardPage() {
	const { user } = useAuth();
	const allUsers = useUserStore((state) => state.users);
	const bills = useBillStore((state) => state.bills);

	const stats = useMemo(() => {
		if (!user) return [];
		return calculateDashboardStats(user.role, allUsers, bills);
	}, [user, allUsers, bills]);

	if (!user) return null;

	const greetings = ["Good morning", "Good afternoon", "Good evening"][
		Math.floor(new Date().getHours() / 8)
	];

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
						delay={i}
					/>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest actions from you and your team
						</CardDescription>
					</CardHeader>
					<CardContent>{/* Activity List */}</CardContent>
				</Card>

				{/* Welcome to Your Dashboard */}
				<Card>
					<CardHeader>
						<CardTitle>Welcome to Your Dashboard</CardTitle>
						<CardDescription>Quick guide to get you started</CardDescription>
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
