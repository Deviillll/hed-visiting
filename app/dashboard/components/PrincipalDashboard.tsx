import { facultyTypeLabels } from "@/app/types/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export function PrincipalDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Principal Dashboard</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">45</div>
						<p className="text-xs text-muted-foreground">
							Active faculty members
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Teaching Faculty
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">35</div>
						<p className="text-xs text-muted-foreground">Active teachers</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Non-Teaching Staff
						</CardTitle>
						<GraduationCap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">10</div>
						<p className="text-xs text-muted-foreground">Support staff</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Faculty Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">{facultyTypeLabels["teaching"]}</p>
									<p className="text-sm text-muted-foreground">
										With teaching rates
									</p>
								</div>
								<div className="text-2xl font-bold">35</div>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">
										{facultyTypeLabels["non-teaching"]}
									</p>
									<p className="text-sm text-muted-foreground">
										With fixed rates
									</p>
								</div>
								<div className="text-2xl font-bold">10</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Academic Calendar</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Current Term</p>
									<p className="text-sm text-muted-foreground">Spring 2024</p>
								</div>
								<div className="text-2xl font-bold">Week 8</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
