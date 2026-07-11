import { prisma } from "@/lib/prisma";
import {
    ContentStatus,
    Platform,
} from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const active =
            await prisma.connectedAccount.findFirst({
                where: {
                    isActive: true,
                },
            });

        if (!active) {
            return NextResponse.json(
                {
                    message: "No active account",
                },
                {
                    status: 400,
                },
            );
        }

        const draft =
            await prisma.content.create({
                data: {
                    platform:
                        Platform.LINKEDIN,

                    status:
                        ContentStatus.DRAFT,

                    title:
                        body.title ?? null,

                    text:
                        body.text ?? "",

                    accountId:
                        active.id,
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
                message:
                    "Failed to save draft",
            },
            {
                status: 500,
            },
        );
    }
}

export async function GET() {
    try {
        const active =
            await prisma.connectedAccount.findFirst({
                where: {
                    isActive: true,
                },
            });

        if (!active) {
            return NextResponse.json([]);
        }

        const drafts =
            await prisma.content.findMany({
                where: {
                    accountId: active.id,
                    status:
                        ContentStatus.DRAFT,
                },

                include: {
                    media: true,
                },

                orderBy: {
                    updatedAt: "desc",
                },
            });

        return NextResponse.json(drafts);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "Failed to fetch drafts",
            },
            {
                status: 500,
            },
        );
    }
}