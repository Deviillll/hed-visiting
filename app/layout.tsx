import { SidebarProvider } from "@/components/sidebar-provider";
import { GalleryVerticalEnd } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "HED Next Visiting",
	description: "HED Next Visiting System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SidebarProvider>
					<header className="flex h-16 items-center border-b px-6">
						<a href="#" className="flex items-center gap-2 font-medium">
							<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-4" />
							</div>
							Acme Inc.
						</a>
					</header>

					{children}

					<footer className="flex h-16 items-center justify-between border-t px-6">
						<div className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} Acme Inc. All rights reserved.
						</div>
						<nav className="flex gap-6">
							<a
								href="#"
								className="text-sm text-muted-foreground hover:underline"
							>
								Privacy
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:underline"
							>
								Terms
							</a>
						</nav>
					</footer>
				</SidebarProvider>
			</body>
		</html>
	);
}
