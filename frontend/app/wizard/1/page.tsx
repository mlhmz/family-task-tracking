"use client";

import { useEffect, useState } from "react";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function createHousehold(householdRequest: HouseholdRequest, router: AppRouterInstance) {
  const response = await fetch("/api/v1/admin/household", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(householdRequest),
  });
  if (response.status == 200) {
    router.push("/wizard/2");
  }
}

export default function FirstWizardPage() {
  const [household, setHousehold] = useState<HouseholdRequest>({ householdName: "" } as HouseholdRequest);
  const router = useRouter();

  const onHouseholdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHousehold({ householdName: e.target.value });
  };

  useEffect(() => {
    console.log(household);
  }, [household]);

  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-2">
      <h1 className="m-auto text-6xl">✨</h1>
      <h3>Step 1</h3>
      <h2 className="text-2xl font-bold">Create a Household</h2>
      <Input
        placeholder="Household Name"
        onChange={onHouseholdInputChange}
        value={household.householdName}
        maxLength={255}
      />
      <Button className="m-auto" onClick={() => createHousehold(household, router)}>
        Next
      </Button>
    </div>
  );
}
