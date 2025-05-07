"use client";

import React from "react";
import { useRoleProtection } from "@/lib/auth-utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Search, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock employees data for search
const mockEmployees = [
	{ id: "1", name: "John Smith", personnelCode: "EMP001" },
	{ id: "2", name: "Sarah Johnson", personnelCode: "EMP002" },
	{ id: "3", name: "Michael Brown", personnelCode: "EMP003" },
	{ id: "4", name: "Emily Davis", personnelCode: "EMP004" },
];

interface Employee {
	id: string;
	name: string;
	personnelCode: string;
	interClasses?: number;
	bsClasses?: number;
}

interface Bill {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: "draft" | "pending_level2" | "pending_principal" | "approved" | "rejected";
	employees: Employee[];
	comments?: string;
	chequeNumber?: string;
	createdBy: string;
	approvedBy?: string;
}

function AddEmployeeDialog({ onAdd }: { onAdd: (employee: Employee, interClasses: number, bsClasses: number) => void }) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [interClasses, setInterClasses] = useState("");
	const [bsClasses, setBsClasses] = useState("");
	const [searchResults, setSearchResults] = useState<Employee[]>([]);

	useEffect(() => {
		if (searchTerm.length >= 2) {
			// In a real app, this would be an API call
			const results = mockEmployees.filter(emp =>
				emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				emp.personnelCode.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	}, [searchTerm]);

	const handleAdd = () => {
		if (!selectedEmployee) {
			toast.error("Please select an employee");
			return;
		}

		const inter = Number(interClasses);
		const bs = Number(bsClasses);

		if (isNaN(inter) || isNaN(bs) || inter < 0 || bs < 0) {
			toast.error("Please enter valid class numbers");
			return;
		}

		onAdd(selectedEmployee, inter, bs);
		setOpen(false);
		setSearchTerm("");
		setSelectedEmployee(null);
		setInterClasses("");
		setBsClasses("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Employee</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Employee to Bill</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Search Employee</Label>
						<Input
							placeholder="Search by name or personnel code"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setSelectedEmployee(null);
							}}
						/>
					</div>

					{searchResults.length > 0 && !selectedEmployee && (
						<div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
							{searchResults.map((emp) => (
								<button
									key={emp.id}
									className="w-full p-2 text-left hover:bg-muted/50 transition-colors"
									onClick={() => setSelectedEmployee(emp)}
								>
									<div className="font-medium">{emp.name}</div>
									<div className="text-sm text-muted-foreground">{emp.personnelCode}</div>
								</button>
							))}
						</div>
					)}

					{selectedEmployee && (
						<div className="space-y-4">
							<div className="p-2 border rounded-lg">
								<div className="font-medium">{selectedEmployee.name}</div>
								<div className="text-sm text-muted-foreground">{selectedEmployee.personnelCode}</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="interClasses">Inter Classes</Label>
									<Input
										id="interClasses"
										type="number"
										min="0"
										value={interClasses}
										onChange={(e) => setInterClasses(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="bsClasses">BS Classes</Label>
									<Input
										id="bsClasses"
										type="number"
										min="0"
										value={bsClasses}
										onChange={(e) => setBsClasses(e.target.value)}
									/>
								</div>
							</div>

							<Button onClick={handleAdd} className="w-full">Add to Bill</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function BillDetailsPage({ params }: { params: { id: string } }) {
	const unwrappedParams = React.use(params);
	const { isLoading } = useRoleProtection(["admin"]);
	const router = useRouter();
	const [bill, setBill] = useState<Bill | null>(null);

	useEffect(() => {
		// In a real app, this would be an API call
		setBill({
			id: unwrappedParams.id,
			name: "January 2025 Teaching Bill",
			startDate: "2025-01-01",
			endDate: "2025-01-31",
			status: "draft",
			employees: [],
			createdBy: "Admin User"
		});
	}, [unwrappedParams.id]);

	const handleAddEmployee = (employee: Employee, interClasses: number, bsClasses: number) => {
		if (!bill) return;

		setBill({
			...bill,
			employees: [
				...bill.employees,
				{ ...employee, interClasses, bsClasses }
			]
		});

		toast.success("Employee added to bill");
	};

	if (isLoading || !bill) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Bills
				</Button>
				<div>
					<h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
						<FileText className="h-6 w-6 text-blue-500" />
						{bill.name}
					</h2>
					<p className="text-muted-foreground">
						{bill.startDate} to {bill.endDate}
					</p>
				</div>
			</div>

			<div className="flex justify-between items-center">
				<Badge className={
					bill.status === "draft" ? "bg-slate-500" :
					bill.status === "pending_level2" ? "bg-amber-500" :
					bill.status === "pending_principal" ? "bg-purple-500" :
					bill.status === "approved" ? "bg-green-500" : "bg-red-500"
				}>
					{bill.status.replace("_", " ").toUpperCase()}
				</Badge>
				{bill.status === "draft" && <AddEmployeeDialog onAdd={handleAddEmployee} />}
			</div>

			<Card className="p-6">
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Employees</h3>
					{bill.employees.length === 0 ? (
						<p className="text-muted-foreground">No employees added yet.</p>
					) : (
						<div className="border rounded-lg divide-y">
							{bill.employees.map((emp) => (
								<div key={emp.id} className="p-4">
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium">{emp.name}</p>
											<p className="text-sm text-muted-foreground">{emp.personnelCode}</p>
										</div>
										<div className="text-right">
											<p>Inter Classes: {emp.interClasses}</p>
											<p>BS Classes: {emp.bsClasses}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}