import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    const { id } = await params;

    const draft =
        await prisma.content.findUnique({
            where: {
                id,
            },
            include: {
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

    const duplicated =
        await prisma.content.create({
            data: {
                title:
                    draft.title
                        ? `${draft.title} Copy`
                        : "Untitled Copy",

                text: draft.text,

                platform:
                    draft.platform,

                status:
                    draft.status,

                accountId:
                    draft.accountId,

                media: {
                    create:
                        draft.media.map(
                            (
                                media,
                            ) => ({
                                type: media.type,
                                url: media.url,
                                mimeType:
                                    media.mimeType,
                                size: media.size,
                                width:
                                    media.width,
                                height:
                                    media.height,
                                duration:
                                    media.duration,
                                thumbnail:
                                    media.thumbnail,
                            }),
                        ),
                },
            },
        });

    return NextResponse.json(
        duplicated,
    );
}