import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { Role, roleLabels } from "@/app/types/role";

interface DashboardLayoutProps {
	children: ReactNode;
	role: Role;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
	const isSuperAdmin = role === 'superadministrator';
	const isAdmin = role === 'administrator' || isSuperAdmin;

	return (
		<div className="drawer lg:drawer-open">
			<input id="my-drawer" type="checkbox" className="drawer-toggle" />

			{/* Page content */}
			<div className="drawer-content flex flex-col">
				{/* Navbar */}
				<div className="w-full navbar bg-base-100 shadow-md">
					<div className="flex-none lg:hidden">
						<label htmlFor="my-drawer" className="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-5 h-5 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>
					<div className="flex-1">
						<Link href="/" className="btn btn-ghost text-xl">
							Dashboard
						</Link>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-muted-foreground">{roleLabels[role]}</span>
						<div className="dropdown dropdown-end">
							<div
								tabIndex={0}
								role="button"
								className="btn btn-ghost btn-circle avatar"
							>
								<div className="w-10 rounded-full">
									<Image
										alt="User"
										src="/avatar-placeholder.png"
										width={40}
										height={40}
										className="rounded-full"
									/>
								</div>
							</div>
							<ul
								tabIndex={0}
								className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<a>Profile</a>
								</li>
								<li>
									<a>Settings</a>
								</li>
								<li>
									<a>Logout</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Main content */}
				<main className="flex-1 p-4">{children}</main>
			</div>

			{/* Sidebar */}
			<div className="drawer-side">
				<label htmlFor="my-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
					<li>
						<Link href="/dashboard" className="active">
							Overview
						</Link>
					</li>
					{isAdmin && (
						<>
							<li>
								<Link href="/dashboard/users">User Management</Link>
							</li>
							<li>
								<Link href="/dashboard/settings">System Settings</Link>
							</li>
						</>
					)}
					{isSuperAdmin && (
						<li>
							<Link href="/dashboard/audit">Audit Logs</Link>
						</li>
					)}
					<li>
						<Link href="/dashboard/profile">My Profile</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
