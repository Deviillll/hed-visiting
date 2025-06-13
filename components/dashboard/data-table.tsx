"use client";

import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface Column<T> {
  key: keyof T | "actions" | "custom" |"department";
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
}


interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	searchField: keyof T;
	itemsPerPage?: number;
}

export function DataTable<T>({
	data,
	columns,
	searchField,
	itemsPerPage = 10,
}: DataTableProps<T>) {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredData = data.filter((item) => {
		const searchValue = String(item[searchField]).toLowerCase();
		return searchValue.includes(search.toLowerCase());
	});

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = filteredData.slice(startIndex, endIndex);

	return (
		<div className="space-y-4">
			<Input
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-sm"
			/>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={String(column.key)} className="">{column.title}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentData.map((item, index) => (
							<TableRow key={index}>
								{columns.map((column) => (
									<TableCell key={String(column.key)}>
										{column.render
											? column.render(item[column.key as keyof T], item)
											: String(item[column.key as keyof T])}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} size={undefined}							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									onClick={() => setCurrentPage(page)}
									isActive={currentPage === page} size={undefined}								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
								className={currentPage === totalPages
									? "pointer-events-none opacity-50"
									: ""} size={undefined}							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
