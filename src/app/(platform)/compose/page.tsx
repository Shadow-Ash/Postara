import { prisma } from "@/lib/prisma";
import { ComposeEditor } from "@/components/compose/ComposeEditor";

export default async function ComposePage({
    searchParams,
}: {
    searchParams: Promise<{
        draft?: string;
    }>;
}) {
    const account =
        await prisma.connectedAccount.findFirst({
            where: {
                isActive: true,
            },
        });

    if (!account) {
        return (
            <div className="flex h-full items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    No Active Account
                </h1>
            </div>
        );
    }

    const { draft } =
        await searchParams;

    let existingDraft = null;

    if (draft) {
        existingDraft =
            await prisma.content.findUnique({
                where: {
                    id: draft,
                },
                include: {
                    media: true,
                },
            });
    }

    return (
        <ComposeEditor
            draft={existingDraft}
            account={{
                id: account.id,
                displayName: account.displayName,
                avatar: account.avatar,
                platform: account.platform,
            }}
        />
    );
}