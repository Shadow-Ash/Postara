import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
    ContentStatus,
} from "@prisma/client";

export async function PATCH(
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

    const body =
        await request.json();

    await prisma.schedule.update({
        where: {
            contentId: id,
        },

        data: {
            publishAt:
                new Date(
                    body.publishAt,
                ),
        },
    });

    return NextResponse.json({
        success: true,
    });
}

export async function DELETE(
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

    await prisma.schedule.delete({
        where: {
            contentId: id,
        },
    });

    await prisma.content.update({
        where: {
            id,
        },

        data: {
            status:
                ContentStatus.DRAFT,
        },
    });

    return NextResponse.json({
        success: true,
    });
}