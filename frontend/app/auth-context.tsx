"use client";

import { AuthProvider, AuthProviderProps } from "react-oidc-context";


export interface AuthContextProps {
  children: React.ReactNode;
  props: AuthProviderProps
}

export default function AuthContext({ children, props }: AuthContextProps) {
  return <AuthProvider {...props}>{children}</AuthProvider>;
}
