import { NextResponse, type NextRequest } from "next/server";
import AppMiddleware from "@/lib/middleware/app";
import { isLanding, parse } from "./lib/middleware/utils";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const { path, key } = parse(req);

  // allow passthrough for all offers, else is caught by app middleware and such
  if (key === "offer") {
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }

  return AppMiddleware(req);
}
