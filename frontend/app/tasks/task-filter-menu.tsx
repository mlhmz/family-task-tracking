"use client";

import { Dispatch, useContext } from "react";

import Avatar from "boring-avatars";
import { z } from "zod";

import { getTranslatedTaskStateValue, TaskState } from "@/types/task-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZodForm } from "@/app/hooks/use-zod-form";

import { ProfilesContext } from "../profiles-context";

const stringQuery = z.object({
  activated: z.boolean().optional(),
  value: z.string().optional(),
});

const numberQuery = z.object({
  activated: z.boolean().optional(),
  operator: z.string().optional(),
  value: z.string().optional(),
});

const dateQuery = z.object({
  activated: z.boolean().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

const uuidQuery = z.object({
  activated: z.boolean().optional(),
  value: z.string().optional(),
});

const schema = z.object({
  pointsQuery: numberQuery.optional(),
  createdAtQuery: dateQuery.optional(),
  updatedAtQuery: dateQuery.optional(),
  taskStateQuery: stringQuery.optional(),
  assigneeQuery: uuidQuery.optional(),
});

type QueryResults = z.infer<typeof schema>;

export default function TaskFilterMenu({ sendQuery }: { sendQuery: Dispatch<string> }) {
  /**
   * According to this issue https://github.com/radix-ui/primitives/issues/1851
   * radix ui primitive checkboxes don't have any event handlers.
   *
   * That's why this is unfortunately solved with setValue and defaultValues
   */
  const { register, handleSubmit, setValue } = useZodForm({
    schema,
    defaultValues: {
      pointsQuery: { activated: false, operator: ":" },
      createdAtQuery: { activated: false },
      updatedAtQuery: { activated: false },
      taskStateQuery: { activated: false, value: "" },
      assigneeQuery: { activated: false, value: "" },
    },
  });
  const { data } = useContext(ProfilesContext);

  const onSubmit = ({
    pointsQuery,
    createdAtQuery,
    updatedAtQuery,
    taskStateQuery,
    assigneeQuery,
  }: QueryResults) => {
    const queries: string[] = [];

    if (pointsQuery?.activated) {
      queries.push(`points${pointsQuery.operator}${pointsQuery.value}`);
    }

    if (createdAtQuery?.activated) {
      queries.push(`createdAt>${createdAtQuery.from},createdAt<${createdAtQuery.to}`);
    }

    if (updatedAtQuery?.activated) {
      queries.push(`updatedAt>${updatedAtQuery.from},updatedAt<${updatedAtQuery.to}`);
    }

    if (taskStateQuery?.activated) {
      queries.push(`taskState:${taskStateQuery.value}`);
    }

    if (assigneeQuery?.activated) {
      queries.push(`assignee.uuid:${assigneeQuery.value}`);
    }

    console.log(queries);
    queries.length !== 0 && sendQuery(queries.join(","));
  };

  return (
    <div className="my-3 flex flex-col gap-3">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox onCheckedChange={(value: boolean) => setValue("pointsQuery.activated", value)} />
          </div>
          <h2>Points</h2>
        </div>

        <fieldset id="points" className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Select
              defaultValue=":"
              onValueChange={(value) => {
                setValue("pointsQuery.operator", value);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=":">equals</SelectItem>
                <SelectItem value=">">greater than</SelectItem>
                <SelectItem value="<">lower than</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Value" {...register("pointsQuery.value")} />
          </div>
        </fieldset>

        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("createdAtQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Created At</h2>
        </div>

        <fieldset id="createdAt" className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <Input type="datetime-local" {...register("createdAtQuery.from")} />
              <p>-</p>
            </div>
            <div>
              <Input type="datetime-local" {...register("createdAtQuery.to")} />
            </div>
          </div>
        </fieldset>

        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("updatedAtQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Updated At</h2>
        </div>

        <fieldset id="updatedAt" className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <Input type="datetime-local" {...register("updatedAtQuery.from")} />
              <p>-</p>
            </div>
            <div>
              <Input type="datetime-local" {...register("updatedAtQuery.to")} />
            </div>
          </div>
        </fieldset>

        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("taskStateQuery.activated", value)}
              {...register("taskStateQuery.activated")}
            />
          </div>
          <h2>Task State</h2>
        </div>
        <fieldset id="taskState" className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Select
              onValueChange={(value) => {
                setValue("taskStateQuery.value", value);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Task State" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskState).map((taskState) => (
                  <SelectItem value={taskState}>{getTranslatedTaskStateValue(taskState)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>

        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("assigneeQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Assignee</h2>
        </div>
        <fieldset id="assignee" className="flex flex-col gap-2">
          <Select
            onValueChange={(value) => {
              setValue("assigneeQuery.value", value);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <>
                {data?.map(
                  (profile) =>
                    profile.uuid && (
                      <SelectItem value={profile?.uuid} key={profile?.uuid}>
                        <div className="flex flex-row gap-5">
                          <Avatar
                            size={32}
                            name={profile?.uuid}
                            variant="beam"
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                          />
                          <p className="flex items-center">{profile?.name}</p>
                        </div>
                      </SelectItem>
                    ),
                )}
              </>
            </SelectContent>
          </Select>
        </fieldset>
        <Button type="submit">Apply filter</Button>
      </form>
    </div>
  );
}
