import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(
    request: Request,
) {
    const form =
        await request.formData();

    const accountId =
        form.get("accountId") as string;

    const account =
        await prisma.connectedAccount.findUnique({
            where: {
                id: accountId,
            },
        });

    if (!account) {
        redirect("/");
    }

    const totalAccounts =
        await prisma.connectedAccount.count();

    if (totalAccounts === 1) {
        throw new Error(
            "Cannot remove your last account.",
        );
    }

    await prisma.connectedAccount.delete({
        where: {
            id: accountId,
        },
    });

    const active =
        await prisma.connectedAccount.findFirst({
            where: {
                isActive: true,
            },
        });

    if (!active) {
        const newest =
            await prisma.connectedAccount.findFirst({
                orderBy: {
                    updatedAt: "desc",
                },
            });

        if (newest) {
            await prisma.connectedAccount.update({
                where: {
                    id: newest.id,
                },
                data: {
                    isActive: true,
                },
            });
        }
    }

    redirect("/");
}