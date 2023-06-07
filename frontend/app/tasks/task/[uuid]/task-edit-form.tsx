import { Dispatch } from "react";

import { Task } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

interface TaskEditFormProps {
  task: Task;
  handleCloseDialog: Dispatch<boolean>;
}

export default function TaskEditForm({ task, handleCloseDialog }: TaskEditFormProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
