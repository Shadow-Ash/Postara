import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {

    const token =
        new URL(request.url)
            .searchParams.get("token");

    if (
        process.env.CRON_SECRET &&
        token !== process.env.CRON_SECRET
    ) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            },
        );
    }

    const now = new Date();

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0,
    );

    const [

        queued,

        processing,

        failed,

        publishedToday,

        nextPost,

    ] = await Promise.all([

        prisma.schedule.count({

            where: {

                publishedAt: null,

                processing: false,

                publishAt: {

                    gt: now,

                },

            },

        }),

        prisma.schedule.count({

            where: {

                processing: true,

            },

        }),

        prisma.schedule.count({

            where: {

                retryCount: {

                    gt: 0,

                },

                publishedAt: null,

            },

        }),

        prisma.schedule.count({

            where: {

                publishedAt: {

                    gte: today,

                },

            },

        }),

        prisma.schedule.findFirst({

            where: {

                publishedAt: null,

            },

            orderBy: {

                publishAt: "asc",

            },

            select: {

                publishAt: true,

                contentId: true,

            },

        }),

    ]);

    return NextResponse.json({

        status: "healthy",

        serverTime:
            now,

        queued,

        processing,

        failed,

        publishedToday,

        nextPost,

    });

}