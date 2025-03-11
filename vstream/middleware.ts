import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    console.log("Middleware Token:", token);

    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/auth")) {
        if (token && token.userId && pathname === "/api/auth/signin") {
            return NextResponse.redirect(new URL("/dashboard", req.url)); 
        }
        return NextResponse.next();
    }

    if (pathname === "/") {
        return NextResponse.next();
    }

    if (!token || !token.userId) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
