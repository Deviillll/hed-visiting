import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FileText } from "lucide-react";

export function EmployeeDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Employee Dashboard</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tasks</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<p className="text-xs text-muted-foreground">Active tasks</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Time Logged</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">32h</div>
						<p className="text-xs text-muted-foreground">This week</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent Activities</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-primary/10 p-2">
								<FileText className="h-4 w-4 text-primary" />
							</div>
							<div>
								<p className="font-medium">Completed task: Project Setup</p>
								<p className="text-sm text-muted-foreground">2 hours ago</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
