import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { getToken } from "next-auth/jwt";

import { ApiHandler } from "@/types/handlers";

import { getJSONResponse, getNoContentResponse } from "@/lib/utils";

const springHandler: ApiHandler = async (request, context) => {
  const jwtLiteral = await getToken({ req: request, secret: env.NEXTAUTH_SECRET, raw: true });
  if (jwtLiteral) {
    const token = jwtLiteral.split(":")[0];
    const uri = context.params["segments"].join("/");
    const householdResponse = await fetch(`${env.BACKEND_API_URL}/${uri}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: request.body,
      method: request.method,
      // @ts-ignore
      duplex: "half",
    });
    try {
      if (householdResponse.status != 204) {
        return await getJSONResponse(householdResponse);
      } else {
        return getNoContentResponse(householdResponse);
      }
    } catch (error) {
      return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 });
  }
};

export {
  springHandler as GET,
  springHandler as POST,
  springHandler as PUT,
  springHandler as PATCH,
  springHandler as DELETE,
};
