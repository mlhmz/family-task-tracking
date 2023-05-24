import { Dispatch } from "react";

import { z } from "zod";

import { useZodForm } from "@/hooks/use-zod-form";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

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

const booleanQuery = z.object({
  activated: z.boolean().optional(),
  toggled: z.boolean().optional(),
});

const schema = z.object({
  pointsQuery: numberQuery.optional(),
  createdAtQuery: dateQuery.optional(),
  updatedAtQuery: dateQuery.optional(),
  privilegedQuery: booleanQuery.optional(),
});

type QueryResults = z.infer<typeof schema>;

export default function ProfileFilterMenu({ sendQuery }: { sendQuery: Dispatch<string> }) {
  /**
   * According to this issue https://github.com/radix-ui/primitives/issues/1851
   * radix ui primitive checkboxes don't have any event handlers.
   *
   * Thats why this is unfortunately solved with setValue and defaultValues
   */
  const { register, handleSubmit, setValue } = useZodForm({
    schema,
    defaultValues: {
      pointsQuery: { activated: false, operator: ":" },
      createdAtQuery: { activated: false },
      updatedAtQuery: { activated: false },
      privilegedQuery: { activated: false, toggled: false },
    },
  });

  const onSubmit = ({ pointsQuery, createdAtQuery, updatedAtQuery, privilegedQuery }: QueryResults) => {
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

    if (privilegedQuery?.activated) {
      queries.push(`permissionType:${privilegedQuery.toggled ? "ADMIN" : "MEMBER"}`);
    }

    queries.length !== 0 ? sendQuery(queries.join(",")) : "";
  };

  return (
    <div className="my-3 flex flex-col gap-3 rounded-md p-3 outline outline-1 outline-border">
      <h1 className="text-lg font-bold">Filter</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col gap-5">
          <div id="points" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox onCheckedChange={(value: boolean) => setValue("pointsQuery.activated", value)} />
              </div>
              <h2>Points</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Auch das geht wohl nicht direkt mit React Hook Form */}
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
          </div>
          <div id="createdAt" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox onCheckedChange={(value: boolean) => setValue("createdAtQuery.activated", value)} />
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
                <Checkbox onCheckedChange={(value: boolean) => setValue("updatedAtQuery.activated", value)} />
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
          <div id="privileged" className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="grid place-items-center">
                <Checkbox
                  onCheckedChange={(value: boolean) => setValue("privilegedQuery.activated", value)}
                />
              </div>
              <h2>Privileged</h2>
            </div>
            <div className="flex gap-3">
              <p className="grid place-items-center text-sm font-bold">Unprivileged</p>
              <Switch onCheckedChange={(value: boolean) => setValue("privilegedQuery.toggled", value)} />
              <p className="grid place-items-center text-sm font-bold">Privileged</p>
            </div>
          </div>
          <Button type="submit">Apply filter</Button>
        </fieldset>
      </form>
    </div>
  );
}