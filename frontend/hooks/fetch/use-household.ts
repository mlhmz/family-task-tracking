import { useEffect, useState } from "react";

async function fetchHousehold() {
  const response = await fetch("/api/v1/household");
  const household = (await response.json()) as HouseholdResponse;
  return {
    ...household,
    status: response.status,
  };
}

export const useHousehold = () => {
  const [household, setHousehold] = useState({} as HouseholdResponse);
  const [isHouseholdEmpty, setIsHouseholdEmpty] = useState(false);

  useEffect(() => {
    async function getHousehold() {
      const householdResponse = await fetchHousehold();
      setHousehold(householdResponse);
      setIsHouseholdEmpty(householdResponse.status == 404);
    }
    getHousehold();
  }, [setHousehold]);

  return {
    isHouseholdEmpty,
    household,
  };
};
