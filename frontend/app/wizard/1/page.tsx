"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

async function createHousehold(householdRequest: HouseholdRequest) {
  const response = await fetch("/api/v1/admin/household", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(householdRequest),
  });
  const household = (await response.json()) as HouseholdResponse;
  return {
    ...household,
    status: response.status,
  };
}

export default function FirstWizardPage() {
  const [household, setHousehold] = useState<HouseholdRequest>({ householdName: "" } as HouseholdRequest);
  const router = useRouter();

  const onHouseholdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHousehold({ householdName: e.target.value });
  };

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="m-auto text-6xl">✨</h1>
      <h3>Step 1</h3>
      <h2 className="text-2xl font-bold">Create a Household</h2>
      <Input
        placeholder="Household Name"
        onChange={onHouseholdInputChange}
        value={household.householdName}
        maxLength={255}
      />
      <Progress className="m-auto h-2 w-1/2" value={25}></Progress>
      <Button
        className={buttonVariants({ size: "sm" })}
        onClick={() =>
          createHousehold(household).then(
            (response) => response && response.status == 200 && router.push("/wizard/2"),
          )
        }>
        Next
      </Button>
    </div>
  );
}
