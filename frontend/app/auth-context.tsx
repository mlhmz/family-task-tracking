"use client";

import { useEffect, useState } from "react";

import { AuthProvider } from "react-oidc-context";

import { Icons } from "@/components/icons";

export interface AuthContextProps {
  children: React.ReactNode;
}

interface KeycloakConfig {
  authority?: string;
  client_id?: string;
}

async function getKeycloakConfig() {
  const result = await fetch("/api/v1/auth/config");
  const data = await result.json();
  return data as KeycloakConfig;
}

export default function AuthContext({ children }: AuthContextProps) {
  const [config, setConfig] = useState<KeycloakConfig | undefined>();

  const fetchConfig = async () => {
    const data = await getKeycloakConfig();
    setConfig(data);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (!config) {
    return (
      <div className="grid h-screen w-full place-items-center">
        <Icons.spinner className="animate-spin" />{" "}
      </div>
    );
  } else {
    const oidcConfig = {
      authority: config.authority ?? "",
      client_id: config.client_id ?? "",
      redirect_uri: "/",
    };
    return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
  }
}
