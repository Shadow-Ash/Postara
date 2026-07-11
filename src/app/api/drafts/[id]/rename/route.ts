import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const draft =
        await prisma.content.update({
            where: {
                id,
            },
            data: {
                title:
                    body.title,
            },
        });

    return NextResponse.json(
        draft,
    );
}