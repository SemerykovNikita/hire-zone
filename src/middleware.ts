import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // const protectedRoutes: { [key: string]: string } = {
  //   "/admin": "admin",
  //   "/employer": "employer",
  //   "/jobseeker": "job_seeker",
  // };

  // const pathname = req.nextUrl.pathname;
  // const requiredRole = Object.keys(protectedRoutes).find((route) =>
  //   pathname.startsWith(route)
  // );

  // if (
  //   pathname.startsWith("/admin/signin") ||
  //   pathname.startsWith("/employer/signin") ||
  //   pathname.startsWith("/jobseeker/signin") ||
  //   pathname.startsWith("/employer/register") ||
  //   pathname.startsWith("/jobseeker/register")
  // ) {
  //   return NextResponse.next();
  // }

  // if (requiredRole) {
  //   const userRole = protectedRoutes[requiredRole];

  //   if (!token || token.role !== userRole) {
  //     const redirectUrl = new URL(`/${userRole}/signin`, req.url);
  //     return NextResponse.redirect(redirectUrl);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/admin/:path*",
    // "/employer/:path*",
    // "/job-seeker/:path*",
    "/user/:path*",
  ],
};
