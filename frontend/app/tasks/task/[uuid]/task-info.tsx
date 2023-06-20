import { useContext, useMemo } from "react";

import { Task } from "@/types/task";
import { formatISODateToReadable } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import InfoPageSkeleton from "@/components/ui/skeleton/info-page-skeleton";
import ProfileShowcase from "@/components/common/profile/profile-showcase";
import { ProfilesContext } from "@/app/profiles-context";

export default function TaskInfo({ task }: { task: Task }) {
  const { data: profiles } = useContext(ProfilesContext);
  const assignee = useMemo(
    () => profiles.find((profile) => profile.uuid === task.assigneeUuid),
    [task, profiles],
  );

  if (!task) return <InfoPageSkeleton />;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Points</h3>
        <div className="flex flex-row gap-1">
          <p className="text-3xl">{task.points}</p>
          <p className="self-end">Points</p>
        </div>
      </div>
      <Separator />
      {task.assigneeUuid && (
        <div className="flex w-full flex-col items-start gap-5">
          <h3 className="font-bold">Assignee</h3>
          <div>
            <ProfileShowcase profileUuid={task.assigneeUuid} pictureSize={64} subtitle />
          </div>
          <Separator />
        </div>
      )}
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Description</h3>
        <p>{task.description}</p>
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-5">
        <h3 className="font-bold">Timestamps</h3>
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold">Created At</h1>
            <p className="text-center">{formatISODateToReadable(task?.createdAt)}</p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold">Updated At</h1>
            <p>{formatISODateToReadable(task.updatedAt)}</p>
          </div>
          {task.expirationAt && (
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-bold">Expires At</h1>
              <p>{formatISODateToReadable(task.expirationAt)}</p>
            </div>
          )}
          {task.doneAt && (
            <div className="flex flex-col items-center">
              <h1 className="text-sm font-bold">Completed at</h1>
              <p>{formatISODateToReadable(task.doneAt)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
