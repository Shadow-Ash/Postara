import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
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
                message: "Draft not found",
            },
            {
                status: 404,
            },
        );
    }

    return NextResponse.json(draft);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const body = await request.json();

        const draft =
            await prisma.content.update({

                where: {
                    id,
                },

                data: {
                    title: body.title,
                    text: body.text,
                    lastSavedAt: new Date(),
                },

                include: {
                    media: true,
                },

            });

        return NextResponse.json(draft);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Failed",
            },
            {
                status: 500,
            },
        );
    }
}