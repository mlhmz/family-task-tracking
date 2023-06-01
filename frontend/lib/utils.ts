import { NextResponse } from "next/server";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export function setResponseHeaders(headers: Headers, originHeaders: Headers) {
  headers.set("WWW-Authenticate", originHeaders.get("WWW-Authenticate") ?? "");
  if (originHeaders.has("date")) {
    headers.set("date", originHeaders.get("date") ?? `${new Date().toISOString}`);
  }
}

export async function getJSONFromResponse(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch (err) {
    return {};
  }
}

export function getNoContentResponse(originResponse: Response) {
  const response = NextResponse.json({ message: "204 No content" }, { status: 200 });
  setResponseHeaders(response.headers, originResponse.headers);
  return response;
}

export function formatISODateToReadable(isoDate?: string) {
  if (isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US");
  } else {
    return "";
  }
}
