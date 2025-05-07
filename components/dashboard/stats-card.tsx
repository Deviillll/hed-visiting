import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
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
          {trend && trendValue && (
            <div className="mt-2 flex items-center text-xs">
              {trend === "up" && (
                <span className="text-green-500">↑ {trendValue}</span>
              )}
              {trend === "down" && (
                <span className="text-red-500">↓ {trendValue}</span>
              )}
              {trend === "neutral" && (
                <span className="text-gray-500">→ {trendValue}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}