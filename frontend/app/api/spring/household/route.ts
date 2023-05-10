import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jwtLiteral = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  const token = jwtLiteral.split(":")[0];
  if (token) {
    const householdResponse = await fetch("http://localhost:8081/api/v1/household", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // TODO: Handle token refresh or getting new token if expired
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

export { handler as GET };
