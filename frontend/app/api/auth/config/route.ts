import { NextResponse } from "next/server";

import { ApiHandler } from "@/types/handlers";
import { env } from "@/env.mjs";

const handler: ApiHandler = async () => {
  return NextResponse.json({
    authority: `${env.OAUTH_ISSUER}`,
    client_id: `${env.OAUTH_CLIENT_ID}`,
  });
};

export { handler as GET };
