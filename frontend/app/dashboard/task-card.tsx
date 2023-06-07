import Link from "next/link";

import { Task } from "@/types/task";
import { getTranslatedTaskStateValue } from "@/types/task-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="min-h-[16.25rem] w-1/6 min-w-[13.875rem]">
      <Link href={`/tasks/task/${task.uuid}`}>
        <CardHeader>
          <CardTitle>
            {task.name && task.name?.length > 32 ? task.name.substring(0, 32) + "..." : task.name}
          </CardTitle>
          <CardDescription>{getTranslatedTaskStateValue(task.taskState || "")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            {task.description && task.description?.length > 64
              ? task.description.substring(0, 64) + "..."
              : task.description}
          </p>
        </CardContent>
        <CardFooter>
          <Badge>{task.points} Points</Badge>
        </CardFooter>
      </Link>
    </Card>
  );
};
