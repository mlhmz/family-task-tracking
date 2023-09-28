import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

import { ApiHandler } from "@/types/handlers";
import { getJSONFromResponse, getNoContentResponse, setResponseHeaders } from "@/lib/utils";

const springHandler: ApiHandler = async (request, context) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (token) {
    const query = !!request.url.split("?")[1] ? `?${request.url.split("?")[1]}` : "";
    const uri = context.params["segments"].join("/") + query;
    try {
      const serverResponse = await fetch(`${env.BACKEND_API_URL}/${uri}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
          "session-id": `${cookieStore.get("session-id")?.value ?? ""}`,
        },
        body: request.body,
        method: request.method,
        // @ts-ignore
        duplex: "half",
      });

      if (serverResponse.status != 204) {
        const content = await getJSONFromResponse(serverResponse);
        if (content && content.sessionId) {
          cookieStore.set("session-id", content.sessionId);
        }
        const nextResponse = NextResponse.json(content, {
          status: serverResponse.status,
        });
        setResponseHeaders(nextResponse.headers, serverResponse.headers);
        return nextResponse;
      } else {
        return getNoContentResponse(serverResponse);
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
