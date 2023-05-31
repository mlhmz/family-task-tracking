"use client";

import {Dispatch} from "react";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getTranslatedTaskStateValue, TaskState} from "@/types/task-state";

import {useZodForm} from "@/app/hooks/use-zod-form";

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

const schema = z.object({
  pointsQuery: numberQuery.optional(),
  createdAtQuery: dateQuery.optional(),
  updatedAtQuery: dateQuery.optional(),
  taskStateQuery: stringQuery.optional(),
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
      taskStateQuery: { activated: false, value:"" },
    },
  });

  const onSubmit = ({pointsQuery, createdAtQuery, updatedAtQuery, taskStateQuery}: QueryResults) => {
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

    console.log(queries);
    queries.length !== 0 && sendQuery(queries.join(","));
  };

  return (
    <div className="my-3 flex flex-col gap-3 rounded-md p-3 outline outline-1 outline-border">
      <h1 className="text-lg font-bold">Filter</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col gap-5">
          <div id="points" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox
                  onCheckedChange={(value: boolean) => setValue("pointsQuery.activated", value)}
                  {...register("pointsQuery.activated")}
                />
              </div>
              <h2>Points</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Auch das geht wohl nicht direkt mit React Hook Form */}
              <Select defaultValue=":" onValueChange={(value) => {setValue("pointsQuery.operator", value)}}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Operator"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=":">equals</SelectItem>
                  <SelectItem value=">">greater than</SelectItem>
                  <SelectItem value="<">lower than</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Value" {...register("pointsQuery.value")} />
            </div>
          </div>
          <div id="createdAt" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox
                  onCheckedChange={(value: boolean) => setValue("createdAtQuery.activated", value)}
                  {...register("createdAtQuery.activated")}
                />
              </div>
              <h2>Created At</h2>
            </div>
            <div className="flex gap-3">
              <p>From: </p>
              <Input type="datetime-local" {...register("createdAtQuery.from")} />
              <p>To: </p>
              <Input type="datetime-local" {...register("createdAtQuery.to")} />
            </div>
          </div>
          <div id="updatedAt" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox
                  onCheckedChange={(value: boolean) => setValue("updatedAtQuery.activated", value)}
                  {...register("updatedAtQuery.activated")}
                />
              </div>
              <h2>Updated At</h2>
            </div>
            <div className="flex gap-3">
              <p>From: </p>
              <Input type="datetime-local" {...register("updatedAtQuery.from")} />
              <p>To: </p>
              <Input type="datetime-local" {...register("updatedAtQuery.to")} />
            </div>
          </div>
          <div id="taskState" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox
                  onCheckedChange={(value: boolean) => setValue("taskStateQuery.activated", value)}
                  {...register("taskStateQuery.activated")}
                />
              </div>
              <h2>Task State</h2>
            </div>
            <div className="flex gap-3">

              <Select onValueChange={(value) => {setValue("taskStateQuery.value", value)}}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Task State"
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskState).map(taskState => <SelectItem value={taskState}>{getTranslatedTaskStateValue(taskState)}</SelectItem>)}
                </SelectContent>
              </Select>

            </div>
          </div>
          <Button type="submit">Apply filter</Button>
        </fieldset>
      </form>
    </div>
  );
}
