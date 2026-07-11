import DraftsPage from "@/components/drafts/DraftsPage";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export default async function Drafts() {
    const active =
        await prisma.connectedAccount.findFirst({
            where: {
                isActive: true,
            },
        });

    if (!active) {
        return (
            <div className="flex h-full items-center justify-center">

                <div className="text-center">

                    <h1 className="text-3xl font-semibold">
                        No Active Account
                    </h1>

                    <p className="mt-2 text-secondary">
                        Connect or switch to a LinkedIn account.
                    </p>

                </div>

            </div>
        );
    }

    const drafts =
        await prisma.content.findMany({
            where: {
                accountId: active.id,
                status: ContentStatus.DRAFT,
            },

            include: {
                media: true,
            },

            orderBy: {
                updatedAt: "desc",
            },
        });

    return (
        <DraftsPage
            initialDrafts={drafts}
        />
    );
}