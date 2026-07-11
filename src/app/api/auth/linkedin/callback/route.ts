import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";

import {
    exchangeCodeForAccessToken,
    getLinkedInUser,
} from "@/lib/linkedin";

export async function GET(
    request: Request,
) {
    try {
        const url = new URL(request.url);

        const error =
            url.searchParams.get("error");

        const errorDescription =
            url.searchParams.get(
                "error_description",
            );

        if (error) {
            return NextResponse.json(
                {
                    error,
                    errorDescription,
                },
                {
                    status: 400,
                },
            );
        }

        const code =
            url.searchParams.get("code");

        const state =
            url.searchParams.get("state");

        const cookieStore =
            await cookies();

        const storedState =
            cookieStore.get(
                "linkedin_oauth_state",
            )?.value;

        if (
            !code ||
            !state ||
            storedState !== state
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid OAuth State",
                },
                {
                    status: 400,
                },
            );
        }

        const token =
            await exchangeCodeForAccessToken(
                code,
            );

        const user =
            await getLinkedInUser(
                token.access_token,
            );

        const dbUser = await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                name: user.name,
            },
            create: {
                name: user.name,
                email: user.email,
            },
        });

        await prisma.connectedAccount.upsert({
            where: {
                platform_providerUserId: {
                    platform: Platform.LINKEDIN,
                    providerUserId: user.sub,
                },
            },
            update: {
                displayName: user.name,

                avatar: user.picture,

                accessToken: token.access_token,

                expiresAt: new Date(
                    Date.now() +
                    token.expires_in * 1000,
                ),

                profileUrl:
                    "https://www.linkedin.com/in/",
            },
            create: {
                platform: Platform.LINKEDIN,

                providerUserId: user.sub,

                displayName: user.name,

                avatar: user.picture,

                accessToken: token.access_token,

                expiresAt: new Date(
                    Date.now() +
                    token.expires_in * 1000,
                ),

                profileUrl:
                    "https://www.linkedin.com/in/",

                userId: dbUser.id,
            },
        });

        return NextResponse.redirect(
            new URL("/", request.url),
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "OAuth callback failed",
            },
            {
                status: 500,
            },
        );
    }
}