import { useContext } from "react";
import Link from "next/link";

import { PermissionType } from "@/types/permission-type";
import { Task } from "@/types/task";
import { getTranslatedTaskStateValue } from "@/types/task-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ProfileContext } from "../profile-context";
import RedeemTaskButton from "../tasks/redeem-task-button";

export const TaskCard = ({ task }: { task: Task }) => {
  const { data: profile } = useContext(ProfileContext);

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
        <CardFooter className="flex gap-1">
          <Badge>{task.points} Points</Badge>
          {profile?.permissionType === PermissionType.Admin && <RedeemTaskButton task={task} />}
        </CardFooter>
      </Link>
    </Card>
  );
};
