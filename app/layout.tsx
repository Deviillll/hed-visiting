import { Providers } from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Role-Based Admin Dashboard",
	description: "A modern admin dashboard with role-based authentication",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					{children}
					<Toaster position="top-right" richColors />
				</Providers>
			</body>
		</html>
	);
}
