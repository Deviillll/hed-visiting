import { AppSidebar } from "@/components/app-sidebar";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Role } from "../types/role";
import { AdminDashboard } from "./components/AdminDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { PrincipalDashboard } from "./components/PrincipalDashboard";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";

export default function DashboardPage() {
	// In a real app, this would come from your auth system
	let userRole: Role = "employee";

	if (typeof window !== "undefined") {
		const userStr = localStorage.getItem("user");
		if (!userStr) {
			redirect("/login");
		}
		const user = JSON.parse(userStr);
		userRole = user.role;
	}

	const renderDashboard = () => {
		switch (userRole) {
			case "superadministrator":
				return <SuperAdminDashboard />;
			case "administrator":
				return <AdminDashboard />;
			case "principal":
				return <PrincipalDashboard />;
			case "employee":
				return <EmployeeDashboard />;
			default:
				return <EmployeeDashboard />;
		}
	};

	return (
		<DashboardLayout role={userRole}>
			<div className="flex">
			
				<div className="ml-64 flex-1">{renderDashboard()}</div>
			</div>
		</DashboardLayout>
	);
}
