import { getTranslatedTaskStateValue, TaskState } from "@/types/task-state";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

const iconsMap = {
  [TaskState.Undone]: <Icons.goal className="m-auto" />,
  [TaskState.Done]: <Icons.check className="m-auto" />,
  [TaskState.Reviewed]: <Icons.checkCheck className="m-auto" />,
  [TaskState.Finished]: <Icons.checkCheck className="m-auto" />,
};

export const TaskStateIcon = ({ taskState }: { taskState?: TaskState }) => {
  if (!taskState) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p>{iconsMap[taskState]}</p>
        </TooltipTrigger>
        <TooltipContent>{getTranslatedTaskStateValue(taskState)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
