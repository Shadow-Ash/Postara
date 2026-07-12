import { promises as fs } from "fs";
import path from "path";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const media =
        await prisma.media.findUnique({
            where: {
                id,
            },
        });

    if (!media) {
        return NextResponse.json(
            {
                message:
                    "Media not found",
            },
            {
                status: 404,
            },
        );
    }

    try {
        const filePath =
            path.join(
                process.cwd(),
                "public",
                media.url,
            );

        await fs.unlink(filePath);
    } catch { }

    await prisma.media.delete({
        where: {
            id,
        },
    });

    return NextResponse.json({
        success: true,
    });
}