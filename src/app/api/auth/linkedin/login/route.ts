import crypto from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createLinkedInAuthUrl } from "@/lib/linkedin";

export async function GET() {
    const state = crypto.randomUUID();

    const cookieStore = await cookies();

    cookieStore.set(
        "linkedin_oauth_state",
        state,
        {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite: "lax",

            path: "/",

            maxAge: 600,
        },
    );

    console.log(createLinkedInAuthUrl(state)); //log

    return NextResponse.redirect(
        createLinkedInAuthUrl(state),
    );
}