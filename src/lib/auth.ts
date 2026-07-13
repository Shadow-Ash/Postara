import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET!,
);

const COOKIE_NAME = "postara_session";

export async function createSession() {
    const expires =
        new Date(
            Date.now() +
            1000 * 60 * 60 * 24 * 30,
        );

    const token =
        await new SignJWT({
            authenticated: true,
        })
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

    (await cookies()).set(
        COOKIE_NAME,
        token,
        {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "lax",
            path: "/",
            expires,
        },
    );
}

export async function verifySession() {
    const token =
        (
            await cookies()
        ).get(
            "postara_session",
        )?.value;

    if (!token)
        return false;

    try {
        await jwtVerify(
            token,
            secret,
        );

        return true;
    } catch {
        return false;
    }
}

export async function destroySession() {
    (
        await cookies()
    ).delete(
        "postara_session",
    );
}