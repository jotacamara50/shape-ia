import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const rawHost = forwardedHost || req.headers.get("host");
  if (!rawHost) return NextResponse.next();

  const host = rawHost.replace(/:\d+$/, "");
  if (!host) return NextResponse.next();

  const isLocalhost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("0.0.0.0");
  if (isLocalhost) return NextResponse.next();

  const normalizedHost = host.startsWith("www.") ? host.slice(4) : host;
  const protoHeader = req.headers.get("x-forwarded-proto");
  const proto = protoHeader ? protoHeader.split(",")[0].trim() : req.nextUrl.protocol.replace(":", "");
  const isHttps = proto === "https";

  if (isHttps && normalizedHost === host) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = normalizedHost;
  url.port = "";

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
