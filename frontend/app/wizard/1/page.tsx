"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { HouseholdRequest } from "@/types/household";
import { isHouseholdResponse } from "@/lib/guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { useZodForm } from "@/app/hooks/use-zod-form";

const postHousehold = async (householdRequest: HouseholdRequest) => {
  const response = await fetch("/api/v1/admin/household", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(householdRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const household = await response.json();
  if (!isHouseholdResponse(household)) throw new Error("Problem fetching data");
  return household;
};

const schema = z.object({
  householdName: z.string().min(1).max(255),
});

export default function FirstWizardPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useZodForm({ schema });
  const { mutate, isLoading } = useMutation({
    mutationFn: postHousehold,
    onSuccess: () => {
      queryClient.invalidateQueries(["household"]);
    },
    onError: (error) => {
      toast.error(`Error creating household: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
  const queryClient = useQueryClient();

  const onSubmit = (formData: HouseholdRequest) =>
    mutate(formData, {
      onSuccess: () => {
        toast.success("Household created!");
        router.push("/wizard/2");
      },
    });

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">✨</h1>
      <h3>Step 1</h3>
      <h2 className="text-2xl font-bold">Create a Household</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col items-center gap-3" disabled={isLoading}>
          <Input placeholder="Household Name" {...register("householdName")} />
          {formState.errors.householdName && (
            <p className="text-destructive">{formState.errors.householdName.message}</p>
          )}
          <Progress className="m-auto h-2 w-1/2" value={25}></Progress>
          <Button size={"sm"} type="submit">
            {isLoading ? <Icons.spinner className="animate-spin text-secondary" /> : <>Next</>}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
