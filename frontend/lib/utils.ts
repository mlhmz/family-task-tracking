import { NextResponse } from "next/server";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function setResponseHeaders(headers: Headers, originHeaders: Headers) {
  headers.set("WWW-Authenticate", originHeaders.get("WWW-Authenticate") ?? "");
  if (originHeaders.has("date")) {
    headers.set("date", originHeaders.get("date") ?? `${new Date().toISOString}`);
  }
}

async function getResponseContent(householdResponse: Response): Promise<any> {
  try {
    const jsonContent = await Promise.resolve(householdResponse.json());
    return jsonContent;
  } catch (err) {
    return "";
  }
}

export async function getJSONResponse(originResponse: Response) {
  const response = NextResponse.json(await getResponseContent(originResponse), {
    status: originResponse.status,
  });
  setResponseHeaders(response.headers, originResponse.headers);
  return response;
}

export function getNoContentResponse(originResponse: Response) {
  const response = NextResponse.json({ message: "204 No content" }, { status: 200 });
  setResponseHeaders(response.headers, originResponse.headers);
  return response;
}
