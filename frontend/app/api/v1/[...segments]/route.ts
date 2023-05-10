import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

function setResponseHeaders(headers: Headers, originHeaders: Headers) {
  headers.set("WWW-Authenticate", originHeaders.get("WWW-Authenticate") ?? "");
  if (originHeaders.has("date")) {
    headers.set("date", originHeaders.get("date") ?? `${new Date().toISOString}`)
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

// Check https://nextjs.org/docs/app/api-reference/file-conventions/route
//  NextResponse != NextApiHandler (NextApiRequest, NextApiResponse): 
//  NextRequest & Response ist das neue NextApiRequest & Response
//  In der Doc wird NextResponse als Return Value benutzt, hier NextApiHandler
//  NextApiHandler arbeitet nicht mit Context
//  TODO: Typesafety
const springHandler = async (req, context: { params }) => {
  const jwtLiteral = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  if (jwtLiteral) {
    const token = jwtLiteral.split(":")[0];
    const url: string = context.params['segments'].join("/");
    const householdResponse = await fetch(`${process.env.BACKEND_API_URL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    try {
      const response = NextResponse.json(
        await getResponseContent(householdResponse),
        { status: householdResponse.status },
      );
      setResponseHeaders(response.headers, householdResponse.headers);
      return response;
    } catch (error) {
      return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 });
  }
};

export { springHandler as GET, springHandler as POST, springHandler as PUT, springHandler as DELETE };

