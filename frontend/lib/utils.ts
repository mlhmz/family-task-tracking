import { NextResponse } from "next/server";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { schedulingSchema } from "@/types/task";

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

/**
 * Builds a cron expression from the user input that is submitted by the Scheduling-Section.
 * If a section is scheduled it will be set with "* /value" in order to schedule it every (value)
 * So * /3 in days context means, schedule every 3 days.
 */
export const buildCronExpressionFromInput = (scheduling: z.infer<typeof schedulingSchema>): string => {
  if (!scheduling.activated) {
    return "";
  }

  const { hours, days, months } = scheduling;

  let hoursExpression = "*";
  // When the days or the months are activated, but the hours are not, their value
  // has to be, in terms of a cron expression, '0' instead of '*'.
  // If it would be a '*' the cron expression would reschedule every hour on the certain day.
  // That is not the functionality we want.
  if (!hours.activated && (days.activated || months.activated)) {
    hoursExpression = "0";
  } else if (hours.activated && hours.value !== 0) {
    // We'll just check here if hours is activated and will set a */${value}
    hoursExpression = `*/${scheduling.hours.value}`;
  }

  let daysExpression = "*";
  // Same thing like in hours applies here, with the only difference, that only months lays over
  // days in the expression.
  if (!days.activated && months.activated) {
    daysExpression = "0";
  } else if (days.activated && days.value !== 0) {
    daysExpression = `*/${scheduling.days.value}`;
  }

  let monthsExpression = "*";
  if (months.activated && months.value !== 0) {
    monthsExpression = `*/${scheduling.months.value}`;
  }

  return `0 0 ${hoursExpression} ${daysExpression} ${monthsExpression} *`;
};
