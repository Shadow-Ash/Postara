import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {

        const formData =
            await request.formData();

        const file =
            formData.get("file") as File;

        const draftId =
            formData.get("draftId") as string;

        if (!file || !draftId) {
            return NextResponse.json(
                {
                    message: "Missing data",
                },
                {
                    status: 400,
                },
            );
        }

        const bytes =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(bytes);

        const extension =
            file.name.split(".").pop();

        const filename =
            `${randomUUID()}.${extension}`;

        const uploadDir =
            path.join(
                process.cwd(),
                "public",
                "uploads",
            );

        await mkdir(uploadDir, {
            recursive: true,
        });

        await writeFile(
            path.join(uploadDir, filename),
            buffer,
        );

        const media =
            await prisma.media.create({

                data: {

                    contentId: draftId,

                    type:
                        file.type.startsWith("video")
                            ? "VIDEO"
                            : "IMAGE",

                    url:
                        `/uploads/${filename}`,

                    mimeType:
                        file.type,

                    size:
                        file.size,

                },

            });

        return NextResponse.json(
            media,
        );

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Upload failed",
            },
            {
                status: 500,
            },
        );

    }
}