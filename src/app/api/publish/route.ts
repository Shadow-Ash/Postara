import { NextResponse } from "next/server";

import {
    ContentStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { publishTextPost } from "@/lib/linkedinPublish";

export async function POST(
    request: Request,
) {
    try {
        const body =
            await request.json();

        const draftId =
            body.draftId;

        if (!draftId) {
            return NextResponse.json(
                {
                    message:
                        "Draft ID is required",
                },
                {
                    status: 400,
                },
            );
        }

        const draft =
            await prisma.content.findUnique({
                where: {
                    id: draftId,
                },
                include: {
                    account: true,
                    media: true,
                },
            });

        if (!draft) {
            return NextResponse.json(
                {
                    message:
                        "Draft not found",
                },
                {
                    status: 404,
                },
            );
        }

        if (
            draft.account.platform !==
            "LINKEDIN"
        ) {
            return NextResponse.json(
                {
                    message:
                        "Only LinkedIn publishing is supported",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            draft.media.length > 0
        ) {
            return NextResponse.json(
                {
                    message:
                        "Media publishing will be added next.",
                },
                {
                    status: 400,
                },
            );
        }

        const result =
            await publishTextPost({
                accessToken:
                    draft.account
                        .accessToken,

                personId:
                    draft.account
                        .providerUserId,

                text: draft.text,
            });

        await prisma.content.update({
            where: {
                id: draft.id,
            },

            data: {
                status:
                    ContentStatus.PUBLISHED,

                platformPostId:
                    result.postId,

                postUrl: result.postId
                    ? `https://www.linkedin.com/feed/update/${encodeURIComponent(
                        result.postId,
                    )}`
                    : null,
            },
        });

        return NextResponse.json({
            success: true,

            postId:
                result.postId,
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    error?.response?.data ??
                    error?.message ??
                    "Publishing failed",
            },
            {
                status: 500,
            },
        );
    }
}