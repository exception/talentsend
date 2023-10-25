import { type NextRequest, NextResponse } from "next/server";
import { parse } from "./utils";
import { getToken } from "next-auth/jwt";
import { type User } from "@prisma/client";

const AppMiddleware = async (req: NextRequest) => {
  const { path } = parse(req);
  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    email?: string;
    user?: User;
  };

  if (!session?.email && path !== "/signup" && path !== "/signin") {
    return NextResponse.redirect(
      new URL(
        `/signin${path !== "/" ? `?next=${encodeURIComponent(path)}` : ""}`,
        req.url,
      ),
    );
  } else if (session?.email) {
    if (path === "/signin" || path === "/signup") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }

  return NextResponse.rewrite(new URL(`/app${path}`, req.url));
};

export default AppMiddleware;
