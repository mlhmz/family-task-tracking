import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// TODO: Check https://nextjs.org/docs/app/api-reference/file-conventions/route
// Params und Type matchen hier irgendwie nicht.
// Vielleicht auch anders nach Update auf 13.4.
const springHandler: NextApiHandler = async (req, res) => {
  const jwtLiteral = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  const token = jwtLiteral.split(":")[0];
  if (token) {
    console.log(req);
    console.log(res);
    console.log(`req: ${JSON.stringify(req)}`);
    console.log(`res: ${JSON.stringify(res)}`);
  } else {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 });
  }
};

export { springHandler as GET, springHandler as POST, springHandler as PUT, springHandler as DELETE };
