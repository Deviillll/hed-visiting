"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface NavItem {
	title: string;
	url: string;
	isActive?: boolean;
}

// This is sample data.
const navigation = [
	{
		title: "Dashboard",
		url: "/dashboard",
	},
	{
		title: "Visitors",
		url: "/visitors",
	},
	{
		title: "Reports",
		url: "/reports",
	},
	{
		title: "Settings",
		url: "/settings",
	},
] satisfies NavItem[];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { isOpen, toggleSidebar } = useSidebar();
	const pathname = usePathname();

	return (
		<Sidebar
			{...props}
			className={cn("transition-all duration-300", !isOpen && "w-16")}
		>
			<SidebarHeader>
				<Button variant="ghost" size="icon" onClick={toggleSidebar}>
					<Menu className="h-4 w-4" />
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>{item.title}</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
