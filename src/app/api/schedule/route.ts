import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
    ContentStatus,
} from "@prisma/client";

export async function POST(
    request: Request,
) {
    try {
        const {
            draftId,
            publishAt,
        } = await request.json();

        if (!draftId) {
            return NextResponse.json(
                {
                    message:
                        "Draft ID required",
                },
                {
                    status: 400,
                },
            );
        }

        await prisma.schedule.upsert({
            where: {
                contentId: draftId,
            },

            update: {
                publishAt:
                    new Date(
                        publishAt,
                    ),
            },

            create: {
                contentId:
                    draftId,

                publishAt:
                    new Date(
                        publishAt,
                    ),
            },
        });

        await prisma.content.update({
            where: {
                id: draftId,
            },

            data: {
                status:
                    ContentStatus.SCHEDULED,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "Unable to schedule",
            },
            {
                status: 500,
            },
        );
    }
}