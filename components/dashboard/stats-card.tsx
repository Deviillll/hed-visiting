import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: ReactNode;

	delay?: number;
}

export function StatsCard({
	title,
	value,
	description,
	icon,
	delay = 0,
}: StatsCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: delay * 0.1 }}
		>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
					{icon}
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{value}</div>
					{description && (
						<p className="text-xs text-muted-foreground">{description}</p>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
