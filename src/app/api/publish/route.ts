import { NextResponse } from "next/server";

import {
    ContentStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { publishPost } from "@/lib/linkedinPublish";

export async function POST(
    request: Request,
) {
    try {
        const { draftId } =
            await request.json();

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

        const images =
            draft.media
                .filter(
                    (m) => m.type === "IMAGE",
                )
                .map(
                    (m) => `public${m.url}`,
                );

        const result =
            await publishPost({
                accessToken:
                    draft.account
                        .accessToken,

                personId:
                    draft.account
                        .providerUserId,

                text:
                    draft.text,

                imagePaths: images,
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

                postUrl:
                    result.postId
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
                    error.response?.data ??
                    error.message ??
                    "Publishing failed",
            },
            {
                status: 500,
            },
        );
    }
}