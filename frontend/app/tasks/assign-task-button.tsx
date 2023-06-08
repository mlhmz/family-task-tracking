import { useState } from "react";

import Avatar from "boring-avatars";

import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

import TaskAssignForm from "./task-assign-form";

export default function AssignTaskButton({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Dialog open={open} onOpenChange={(value: boolean) => setOpen(value)}>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <Icons.userCircle />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Assign a Profile</DialogHeader>
              <TaskAssignForm taskUuid={task.uuid} handleAssignSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Assign Profile</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
