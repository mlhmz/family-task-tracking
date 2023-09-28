import { NextResponse } from "next/server";

import { ApiHandler } from "@/types/handlers";

const handler: ApiHandler = async () => {
  return NextResponse.json({
    authority: process.env.KEYCLOAK_ISSUER,
    client_id: process.env.KEYCLOAK_CLIENT_ID,
  });
};

export { handler as GET };
