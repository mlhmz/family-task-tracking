"use client";

import { useEffect, useState } from "react";

import { AuthProvider } from "react-oidc-context";

import { Icons } from "@/components/icons";
import { z } from "zod";

export interface AuthContextProps {
  children: React.ReactNode;
}

const KeycloakConfigSchema = z.object({
  authority: z.string().min(1),
  client_id: z.string().min(1)
});

type KeycloakConfig = z.infer<typeof KeycloakConfigSchema>;

async function getKeycloakConfig() {
  const result = await fetch("/api/auth/config");
  const data = await result.json();
  return KeycloakConfigSchema.parse(data);
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
