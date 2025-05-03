import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";

export function SuperAdminDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Super Administrator Dashboard</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">System Status</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">100%</div>
						<p className="text-xs text-muted-foreground">
							All systems operational
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Security Alerts
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2</div>
						<p className="text-xs text-muted-foreground">Active alerts</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Audit Logs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Recent Changes</p>
									<p className="text-sm text-muted-foreground">Last 24 hours</p>
								</div>
								<div className="text-2xl font-bold">45</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>System Configuration</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Active Services</p>
									<p className="text-sm text-muted-foreground">
										Running instances
									</p>
								</div>
								<div className="text-2xl font-bold">12</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
