import { NextRequest, NextResponse } from "next/server";

export interface ApiContextParams {
  [route_name: string]: string[];
}

export interface ApiContext {
  params: ApiContextParams;
}

export type ApiHandler = (request: NextRequest, context: ApiContext) => Promise<NextResponse>;
