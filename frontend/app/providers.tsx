import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/theme-provider";

import { AuthProviderProps } from "react-oidc-context";
import AuthContext from "./auth-context";
import AuthGuard from "./auth-guard";
import HouseholdContextProvider from "./household-context";
import ProfileContextProvider from "./profile-context";
import ProfilesContextProvider from "./profiles-context";
import QueryClientProvider from "./query-client";
import { env } from "@/env.mjs";

interface ProvidersProps {
  children: React.ReactNode;
}

const oidcConfig = {
  authority: env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
  client_id: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: "/",
} satisfies AuthProviderProps;

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <div className="relative flex min-h-screen flex-col">
            <AuthContext props={oidcConfig}>
              <HouseholdContextProvider>
                <ProfileContextProvider>
                  <ProfilesContextProvider>
                    <AuthGuard>{children}</AuthGuard>
                  </ProfilesContextProvider>
                </ProfileContextProvider>
              </HouseholdContextProvider>
            </AuthContext>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};
