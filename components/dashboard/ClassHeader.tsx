"use client";

import { Layers3 } from "lucide-react";
import { Class, ClassDialog } from "./ClassDialog";




interface Props {
  onAdd: (data: Partial<Class>) => void;
}

export function ClassHeader({ onAdd }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Layers3 className="h-6 w-6 text-blue-500" />
          Classes
        </h2>
        <p className="text-muted-foreground">Manage classes in your system</p>
      </div>
      <ClassDialog onSave={onAdd} triggerType="button" />
    </div>
  );
}
