"use client";

import Link from "next/link";

import {
    Calendar,
    Clock3,
    Pencil,
    Send,
    Trash2,
} from "lucide-react";

export function ScheduledPage({
    posts,
}: any) {
    async function publishNow(
        id: string,
    ) {
        await fetch("/api/publish", {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                draftId: id,
            }),
        });

        location.reload();
    }

    async function cancel(
        id: string,
    ) {
        if (
            !confirm(
                "Cancel schedule?",
            )
        )
            return;

        await fetch(
            `/api/schedule/${id}`,
            {
                method: "DELETE",
            },
        );

        location.reload();
    }

    async function edit(
        id: string,
        current: string,
    ) {
        const value =
            prompt(
                "New Date & Time\nYYYY-MM-DDTHH:mm",
                current.slice(
                    0,
                    16,
                ),
            );

        if (!value) return;

        await fetch(
            `/api/schedule/${id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    publishAt:
                        value,
                }),
            },
        );

        location.reload();
    }

    return (
        <div className="mx-auto max-w-6xl">

            <h1 className="mb-8 text-3xl font-semibold">
                Scheduled Posts
            </h1>

            <div className="space-y-5">

                {posts.map(
                    (post: any) => (
                        <div
                            key={post.id}
                            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6"
                        >
                            <div className="flex justify-between">

                                <div>

                                    <p className="font-semibold">
                                        Scheduled
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-secondary">

                                        <Calendar size={15} />

                                        {new Date(
                                            post.schedule.publishAt,
                                        ).toLocaleString()}

                                    </div>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            publishNow(
                                                post.id,
                                            )
                                        }
                                        className="rounded-lg border px-3 py-2"
                                    >
                                        <Send size={18} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            cancel(
                                                post.id,
                                            )
                                        }
                                        className="rounded-lg border px-3 py-2 text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            </div>

                            <Link
                                href={`/compose?draft=${post.id}`}
                                className="mt-5 block whitespace-pre-wrap"
                            >
                                {post.text}
                            </Link>

                        </div>
                    ),
                )}

            </div>

        </div>
    );
}