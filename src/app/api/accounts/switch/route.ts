import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const formData = await request.formData();

    const accountId = formData.get("accountId") as string;

    await prisma.connectedAccount.updateMany({
        data: {
            isActive: false,
        },
    });

    await prisma.connectedAccount.update({
        where: {
            id: accountId,
        },
        data: {
            isActive: true,
        },
    });

    return NextResponse.redirect(
        new URL("/", request.url),
    );
}