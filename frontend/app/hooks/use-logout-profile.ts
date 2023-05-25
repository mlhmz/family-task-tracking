"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCookie } from "react-use";

export const useLogoutProfile = () => {
  const [_value, _updateCookie, deleteCookie] = useCookie("session-id");
  const queryClient = useQueryClient();

  const logoutProfile = () => {
    deleteCookie();
    queryClient.cancelQueries(["profile"]);
    queryClient.setQueryData(["profile"], {});
  };
  return { logoutProfile };
};
