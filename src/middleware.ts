import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET!,
);

const PUBLIC_ROUTES = [
    "/login",
    "/api/login",
    "/api/logout",
    "/api/cron/publish",
];

export async function middleware(
    request: NextRequest,
) {
    console.log("🔥 Middleware:", request.nextUrl.pathname); // log

    const pathname =
        request.nextUrl.pathname;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/uploads") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    if (
        PUBLIC_ROUTES.some((route) =>
            pathname.startsWith(route),
        )
    ) {
        return NextResponse.next();
    }

    const token =
        request.cookies.get(
            "postara_session",
        )?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL(
                "/login",
                request.url,
            ),
        );
    }

    try {
        await jwtVerify(
            token,
            secret,
        );

        return NextResponse.next();
    } catch {
        const response =
            NextResponse.redirect(
                new URL(
                    "/login",
                    request.url,
                ),
            );

        response.cookies.delete(
            "postara_session",
        );

        return response;
    }
}

export const config = {
    matcher: [
        "/((?!.*\\.).*)",
    ],
};