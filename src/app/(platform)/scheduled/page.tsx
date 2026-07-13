import Link from "next/link";

import {
    ContentStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
    ScheduledPage,
} from "@/components/scheduled/ScheduledPage";

export default async function Page() {
    const active =
        await prisma.connectedAccount.findFirst({
            where: {
                isActive: true,
            },
        });

    if (!active) {
        return (
            <div className="p-10">
                No Active Account
            </div>
        );
    }

    const posts =
        await prisma.content.findMany({
            where: {
                accountId: active.id,

                status:
                    ContentStatus.SCHEDULED,
            },

            include: {
                media: true,

                schedule: true,
            },

            orderBy: {
                schedule: {
                    publishAt:
                        "asc",
                },
            },
        });

    return (
        <ScheduledPage
            posts={posts}
        />
    );
}