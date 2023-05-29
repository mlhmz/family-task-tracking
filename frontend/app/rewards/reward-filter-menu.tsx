"use client";

import { Dispatch, useContext } from "react";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useZodForm } from "@/app/hooks/use-zod-form";

import { ProfilesContext } from "../profiles-context";
import Avatar from "boring-avatars";

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

const uuidQuery = z.object({
  activated: z.boolean().optional(),
  value: z.string().optional(),
});

const schema = z.object({
  costQuery: numberQuery.optional(),
  createdAtQuery: dateQuery.optional(),
  updatedAtQuery: dateQuery.optional(),
  redeemedQuery: booleanQuery.optional(),
  redeemedAtQuery: dateQuery.optional(),
  redeemedByQuery: uuidQuery.optional(),
});

type QueryResults = z.infer<typeof schema>;

export default function RewardFilterMenu({ sendQuery }: { sendQuery: Dispatch<string> }) {
  /**
   * According to this issue https://github.com/radix-ui/primitives/issues/1851
   * radix ui primitive checkboxes (and also selects) don't have any event handlers
   * for react-hook-form.
   *
   * Thats why this is unfortunately solved with setValue and defaultValues
   */
  const { register, handleSubmit, setValue } = useZodForm({
    schema,
    defaultValues: {
      costQuery: { activated: false, operator: ":" },
      createdAtQuery: { activated: false },
      updatedAtQuery: { activated: false },
      redeemedQuery: { activated: false, toggled: false },
      redeemedAtQuery: { activated: false },
      redeemedByQuery: { activated: false },
    },
  });
  const { data } = useContext(ProfilesContext);

  const onSubmit = ({
    costQuery,
    createdAtQuery,
    updatedAtQuery,
    redeemedQuery,
    redeemedAtQuery,
    redeemedByQuery,
  }: QueryResults) => {
    const queries: string[] = [];

    costQuery?.activated && queries.push(`cost${costQuery.operator}${costQuery.value}`);
    createdAtQuery?.activated &&
      queries.push(`createdAt>${createdAtQuery.from},createdAt<${createdAtQuery.to}`);
    updatedAtQuery?.activated &&
      queries.push(`updatedAt>${updatedAtQuery.from},updatedAt<${updatedAtQuery.to}`);
    redeemedQuery?.activated && queries.push(`redeemed:${redeemedQuery.toggled}`);
    redeemedAtQuery?.activated &&
      queries.push(`redeemedAt>${redeemedAtQuery.from},redeemedAt<${redeemedAtQuery.to}`);
    redeemedByQuery?.activated && queries.push(`redeemedBy.uuid:${redeemedByQuery.value}`);

    queries.length !== 0 ? sendQuery(queries.join(",")) : sendQuery("");
  };

  return (
    <div className="my-3 flex flex-col gap-3 rounded-md p-3 outline outline-1 outline-border">
      <h1 className="text-lg font-bold">Filter</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox onCheckedChange={(value: boolean) => setValue("costQuery.activated", value)} />
          </div>
          <h2>Cost</h2>
        </div>
        <fieldset id="cost" className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Select
              defaultValue=":"
              onValueChange={(value) => {
                setValue("costQuery.operator", value);
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
            <Input placeholder="Value" {...register("costQuery.value")} />
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
          <div className="flex gap-3">
            <p>From: </p>
            <Input type="datetime-local" {...register("createdAtQuery.from")} />
            <p>To: </p>
            <Input type="datetime-local" {...register("createdAtQuery.to")} />
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
          <div className="flex gap-3">
            <p>From: </p>
            <Input type="datetime-local" {...register("updatedAtQuery.from")} />
            <p>To: </p>
            <Input type="datetime-local" {...register("updatedAtQuery.to")} />
          </div>
        </fieldset>
        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("redeemedQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Redeemed</h2>
        </div>
        <fieldset id="redeemed" className="flex flex-col gap-2">
          <div className="flex gap-3">
            <p className="grid place-items-center text-sm font-bold">Unredeemed</p>
            <Switch onCheckedChange={(value: boolean) => setValue("redeemedQuery.toggled", value)} />
            <p className="grid place-items-center text-sm font-bold">Redeemed</p>
          </div>
        </fieldset>
        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("redeemedAtQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Redeemed At</h2>
        </div>
        <fieldset id="redeemedAt" className="flex flex-col gap-2">
          <div className="flex gap-3">
            <p>From: </p>
            <Input type="datetime-local" {...register("redeemedAtQuery.from")} />
            <p>To: </p>
            <Input type="datetime-local" {...register("redeemedAtQuery.to")} />
          </div>
        </fieldset>
        <div className="flex gap-2">
          <div className="grid place-items-center">
            <Checkbox
              onCheckedChange={(value: boolean) => setValue("redeemedByQuery.activated", value)}
              disabled={false}
            />
          </div>
          <h2>Redeemed By</h2>
        </div>
        <fieldset id="redeemedBy" className="flex flex-col gap-2">
          <Select
            onValueChange={(value) => {
              setValue("redeemedByQuery.value", value);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Redeemed By" />
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
