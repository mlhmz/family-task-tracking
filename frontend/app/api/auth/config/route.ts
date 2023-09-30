import { NextResponse } from "next/server";

import { ApiHandler } from "@/types/handlers";
import { env } from "@/env.mjs";

const handler: ApiHandler = async () => {
  return NextResponse.json({
    authority: env.KEYCLOAK_ISSUER,
    client_id: env.KEYCLOAK_CLIENT_ID,
  });
};

export { handler as GET };
