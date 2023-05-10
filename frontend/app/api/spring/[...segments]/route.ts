import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// TODO: Check https://nextjs.org/docs/app/api-reference/file-conventions/route
//  NextResponse != NextApiHandler (NextApiRequest, NextApiResponse): 
//  NextRequest & Response ist das neue NextApiRequest & Response
//  In der Doc wird NextResponse als Return Value benutzt, hier NextApiHandler
//  NextApiHandler arbeitet nicht mit Context
//  Weiterhin besteht aber das TODO: springHandler sowie Context Typen
const springHandler = async (req, context: { params }) => {
  const jwtLiteral = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  const token = jwtLiteral.split(":")[0];
  if (token) {
    const url: string = context.params['segments'].join("/");
    const householdResponse = await fetch(`${process.env.BACKEND_API_URL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      const responseText = await householdResponse.text();
      return NextResponse.json(
        { token: token, res: await Promise.resolve(responseText), status: householdResponse.status },
        { status: householdResponse.status },
      );
    } catch (error) {
      return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 });
  }
};

export { springHandler as GET, springHandler as POST, springHandler as PUT, springHandler as DELETE };
