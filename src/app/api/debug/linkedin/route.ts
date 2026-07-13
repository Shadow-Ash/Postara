// src/app/api/debug/linkedin/route.ts

import { prisma } from "@/lib/prisma";

export async function GET() {
    const account =
        await prisma.connectedAccount.findFirst({
            where: {
                isActive: true,
            },
        });

    const response =
        await fetch(
            "https://api.linkedin.com/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${account?.accessToken}`,
                },
            },
        );

    return Response.json({
        databaseProviderId:
            account?.providerUserId,

        linkedInResponse:
            await response.json(),
    });
}