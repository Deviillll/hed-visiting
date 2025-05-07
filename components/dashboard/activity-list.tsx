"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
  category: "create" | "update" | "delete" | "login";
}

const categoryStyles = {
  create: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  update: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  login: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
};

interface ActivityListProps {
  activities: Activity[];
  maxHeight?: string;
}

export function ActivityList({ activities, maxHeight = "400px" }: ActivityListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <ScrollArea className={`w-full max-h-[${maxHeight}]`}>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 p-1"
      >
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            variants={item}
            className="flex items-start space-x-4 rounded-lg p-3 transition-all hover:bg-muted/50"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>
                <UserCircle className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {activity.action}
              </p>
              <div className="mt-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    categoryStyles[activity.category]
                  )}
                >
                  {activity.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </ScrollArea>
  );
}