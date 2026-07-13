import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { publishPost } from "@/lib/linkedinPublish";

export const dynamic = "force-dynamic";

const STUCK_JOB_TIMEOUT_MS = 10 * 60 * 1000;
const BATCH_LIMIT = 20;
const CANDIDATE_LIMIT = 100;
const MAX_RETRIES = 10;

type ClaimedScheduleRow = {
    id: string;
};

type ErrorLike = {
    message?: string;
    response?: {
        status?: number;
        data?: {
            message?: string;
            code?: string;
        };
    };
};

function buildLinkedInPostUrl(postId: string) {
    return `https://www.linkedin.com/feed/update/${encodeURIComponent(
        postId,
    )}`;
}

function getCompactErrorMessage(error: unknown) {
    const err = error as ErrorLike;

    const responseMessage =
        typeof err?.response?.data?.message === "string" &&
            err.response.data.message.trim().length > 0
            ? err.response.data.message.trim()
            : null;

    const responseCode =
        typeof err?.response?.data?.code === "string" &&
            err.response.data.code.trim().length > 0
            ? err.response.data.code.trim()
            : null;

    const baseMessage =
        responseMessage ??
        responseCode ??
        (typeof err?.message === "string" && err.message.trim().length > 0
            ? err.message.trim()
            : "Unknown error");

    return err?.response?.status
        ? `HTTP ${err.response.status}: ${baseMessage}`
        : baseMessage;
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    const queryToken = request.nextUrl.searchParams.get("token");

    const token = headerToken ?? queryToken;

    if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            },
        );
    }

    const startedAt = Date.now();
    const now = new Date();

    try {
        /*
        |--------------------------------------------------------------------------
        | Recover stuck jobs
        |--------------------------------------------------------------------------
        */

        await prisma.schedule.updateMany({
            where: {
                processing: true,
                publishedAt: null,
                lastAttemptAt: {
                    lt: new Date(Date.now() - STUCK_JOB_TIMEOUT_MS),
                },
            },
            data: {
                processing: false,
            },
        });

        /*
        |--------------------------------------------------------------------------
        | Claim due schedules in one query
        |--------------------------------------------------------------------------
        */

        const claimedRows = await prisma.$queryRaw<ClaimedScheduleRow[]>`
            WITH candidate_schedules AS (
                SELECT
                    s.id,
                    CASE
                        WHEN s."retryCount" <= 0 THEN s."publishAt"
                        ELSE COALESCE(s."lastAttemptAt", s."publishAt") + make_interval(mins => (1 << (s."retryCount" - 1)))
                    END AS "nextAttemptAt"
                FROM "Schedule" s
                INNER JOIN "Content" c
                    ON c.id = s."contentId"
                LEFT JOIN "ConnectedAccount" a
                    ON a.id = c."accountId"
                WHERE
                    s."publishAt" <= NOW()
                    AND s."publishedAt" IS NULL
                    AND s."processing" = false
                    AND s."retryCount" < ${MAX_RETRIES}
                    AND c."status" = CAST(${ContentStatus.SCHEDULED} AS "ContentStatus")
                    AND COALESCE(a."needsReconnect", false) = false
                ORDER BY
                    s."publishAt" ASC,
                    s."lastAttemptAt" ASC NULLS FIRST
                LIMIT ${CANDIDATE_LIMIT}
            ),
            due_schedules AS (
                SELECT id
                FROM candidate_schedules
                WHERE "nextAttemptAt" <= NOW()
                ORDER BY "nextAttemptAt" ASC
                LIMIT ${BATCH_LIMIT}
            ),
            claimed AS (
                UPDATE "Schedule" s
                SET
                    "processing" = true,
                    "lastAttemptAt" = NOW()
                FROM due_schedules d
                WHERE
                    s.id = d.id
                    AND s."processing" = false
                    AND s."publishedAt" IS NULL
                RETURNING s.id
            )
            SELECT id
            FROM claimed;
        `;

        const claimed = claimedRows.map((row) => row.id);

        if (!claimed.length) {
            return NextResponse.json({
                success: true,
                processed: 0,
                results: [],
                durationMs: Date.now() - startedAt,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Load claimed schedules
        |--------------------------------------------------------------------------
        */

        const schedules = await prisma.schedule.findMany({
            where: {
                id: {
                    in: claimed,
                },
            },
            include: {
                content: {
                    include: {
                        account: true,
                        media: true,
                    },
                },
            },
        });

        const results: Array<{
            id: string;
            status: "published" | "failed";
        }> = [];

        for (const schedule of schedules) {
            try {
                const alreadyPublished =
                    schedule.content.status === ContentStatus.PUBLISHED ||
                    !!schedule.content.platformPostId;

                /*
                |--------------------------------------------------------------------------
                | Defensive idempotency
                |--------------------------------------------------------------------------
                */

                if (alreadyPublished) {
                    await prisma.$transaction([
                        prisma.content.update({
                            where: {
                                id: schedule.content.id,
                            },
                            data: {
                                status: ContentStatus.PUBLISHED,
                                platformPostId:
                                    schedule.content.platformPostId ?? undefined,
                                postUrl: schedule.content.platformPostId
                                    ? buildLinkedInPostUrl(
                                        schedule.content.platformPostId,
                                    )
                                    : schedule.content.postUrl ?? undefined,
                            },
                        }),
                        prisma.schedule.update({
                            where: {
                                id: schedule.id,
                            },
                            data: {
                                processing: false,
                                publishedAt: new Date(),
                                errorMessage: null,
                            },
                        }),
                    ]);

                    results.push({
                        id: schedule.content.id,
                        status: "published",
                    });

                    continue;
                }

                const imagePaths = schedule.content.media
                    .filter((m) => m.type === "IMAGE")
                    .map((m) =>
                        path.join(
                            process.cwd(),
                            "public",
                            m.url.replace(/^\/+/, ""),
                        ),
                    );

                console.info("Publishing scheduled post", {
                    scheduleId: schedule.id,
                    draftId: schedule.content.id,
                    account: schedule.content.account.displayName,
                    mediaCount: imagePaths.length,
                    retryCount: schedule.retryCount,
                });

                const published = await publishPost({
                    accessToken: schedule.content.account.accessToken,
                    personId: schedule.content.account.providerUserId,
                    text: schedule.content.text,
                    imagePaths,
                });

                await prisma.$transaction([
                    prisma.content.update({
                        where: {
                            id: schedule.content.id,
                        },
                        data: {
                            status: ContentStatus.PUBLISHED,
                            platformPostId: published.postId,
                            postUrl: published.postId
                                ? buildLinkedInPostUrl(published.postId)
                                : null,
                        },
                    }),
                    prisma.schedule.update({
                        where: {
                            id: schedule.id,
                        },
                        data: {
                            processing: false,
                            publishedAt: new Date(),
                            errorMessage: null,
                        },
                    }),
                ]);

                results.push({
                    id: schedule.content.id,
                    status: "published",
                });
            } catch (error: unknown) {
                console.error(error);

                const err = error as ErrorLike;

                if (err?.message === "LINKEDIN_RECONNECT_REQUIRED") {
                    await prisma.connectedAccount.update({
                        where: {
                            id: schedule.content.account.id,
                        },
                        data: {
                            needsReconnect: true,
                        },
                    });
                }

                const nextRetryCount = schedule.retryCount + 1;
                const permanentFailure = nextRetryCount >= MAX_RETRIES;

                if (permanentFailure) {
                    await prisma.$transaction([
                        prisma.content.update({
                            where: {
                                id: schedule.content.id,
                            },
                            data: {
                                status: ContentStatus.FAILED,
                            },
                        }),
                        prisma.schedule.update({
                            where: {
                                id: schedule.id,
                            },
                            data: {
                                processing: false,
                                retryCount: nextRetryCount,
                                lastAttemptAt: new Date(),
                                errorMessage: getCompactErrorMessage(error),
                            },
                        }),
                    ]);
                } else {
                    await prisma.schedule.update({
                        where: {
                            id: schedule.id,
                        },
                        data: {
                            processing: false,
                            retryCount: {
                                increment: 1,
                            },
                            lastAttemptAt: new Date(),
                            errorMessage: getCompactErrorMessage(error),
                        },
                    });
                }

                results.push({
                    id: schedule.content.id,
                    status: "failed",
                });
            }
        }

        console.info("Cron publish finished", {
            processed: results.length,
            published: results.filter((r) => r.status === "published").length,
            failed: results.filter((r) => r.status === "failed").length,
            durationMs: Date.now() - startedAt,
        });

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
            durationMs: Date.now() - startedAt,
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message ?? "Cron failed",
            },
            {
                status: 500,
            },
        );
    }
}