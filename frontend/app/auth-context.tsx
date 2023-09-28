"use client";

import { useEffect } from "react";
import { AuthProvider } from "react-oidc-context";

export interface AuthContextProps {
  children: React.ReactNode;
}

const oidcConfig = {
  authority: "https://keycloak.questie.xyz/realms/ftt",
  client_id: "ftt-client",
  redirect_uri: "/",
}

export default function AuthContext({ children }: AuthContextProps) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
