// proxy.ts
import { auth } from "./auth";

export const proxy = auth;

export const config = {
  // This matcher ensures it runs on all pages except internal Next.js files and static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
