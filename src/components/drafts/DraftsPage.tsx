"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
    Content,
    Media,
} from "@prisma/client";

type Draft =
    Content & {
        media: Media[];
    };

type Props = {
    initialDrafts: Draft[];
};

type SortMode = "newest" | "oldest" | "edited";

function formatDate(value: string | Date) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function formatTime(value: string | Date) {
    return new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

function getPreviewCount(draft: Draft) {
    return draft.media.length;
}

export default function DraftsPage({
    initialDrafts,
}: Props) {
    const [drafts, setDrafts] =
        useState(initialDrafts);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortMode, setSortMode] =
        useState<SortMode>("newest");
    const [editingId, setEditingId] =
        useState<string | null>(null);
    const [editingTitle, setEditingTitle] =
        useState("");
    const [deleteTarget, setDeleteTarget] =
        useState<Draft | null>(null);
    const [busyId, setBusyId] =
        useState<string | null>(null);

    async function loadDrafts() {
        setLoading(true);

        try {
            const response =
                await fetch("/api/drafts", {
                    cache: "no-store",
                });

            const data =
                (await response.json()) as Draft[];

            setDrafts(data);
        } finally {
            setLoading(false);
        }
    }

    const filteredDrafts = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        const filtered = drafts.filter(
            (draft) => {
                const title = (
                    draft.title ??
                    "Untitled Draft"
                ).toLowerCase();
                const text =
                    draft.text.toLowerCase();

                return (
                    title.includes(query) ||
                    text.includes(query)
                );
            },
        );

        const sorted = [...filtered].sort(
            (a, b) => {
                if (sortMode === "oldest") {
                    return (
                        new Date(
                            a.createdAt,
                        ).getTime() -
                        new Date(
                            b.createdAt,
                        ).getTime()
                    );
                }

                if (sortMode === "edited") {
                    return (
                        new Date(
                            b.updatedAt,
                        ).getTime() -
                        new Date(
                            a.updatedAt,
                        ).getTime()
                    );
                }

                return (
                    new Date(
                        b.createdAt,
                    ).getTime() -
                    new Date(
                        a.createdAt,
                    ).getTime()
                );
            },
        );

        return sorted;
    }, [drafts, search, sortMode]);

    async function duplicateDraft(id: string) {
        setBusyId(id);

        try {
            await fetch(
                `/api/drafts/${id}/duplicate`,
                {
                    method: "POST",
                },
            );

            await loadDrafts();
        } finally {
            setBusyId(null);
        }
    }

    async function renameDraft(
        id: string,
        title: string,
    ) {
        setBusyId(id);

        try {
            await fetch(
                `/api/drafts/${id}/rename`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title,
                    }),
                },
            );

            await loadDrafts();
        } finally {
            setBusyId(null);
        }
    }

    async function deleteDraft(id: string) {
        setBusyId(id);

        try {
            await fetch(
                `/api/drafts/${id}/delete`,
                {
                    method: "DELETE",
                },
            );

            await loadDrafts();
        } finally {
            setBusyId(null);
            setDeleteTarget(null);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <h1 className="text-3xl font-semibold">
                    Drafts
                </h1>
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-secondary">
                    Loading drafts...
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">
                            Drafts
                        </h1>
                        <p className="mt-1 text-sm text-secondary">
                            {filteredDrafts.length} drafts
                            found
                        </p>
                    </div>

                    <Link
                        href="/compose"
                        className="rounded-xl bg-primary px-5 py-3 font-medium text-on-primary transition hover:opacity-90"
                    >
                        + New Draft
                    </Link>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value,
                            )
                        }
                        placeholder="Search drafts..."
                        className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary"
                    />

                    <select
                        value={sortMode}
                        onChange={(e) =>
                            setSortMode(
                                e.target
                                    .value as SortMode,
                            )
                        }
                        className="rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary"
                    >
                        <option value="newest">
                            Newest
                        </option>
                        <option value="oldest">
                            Oldest
                        </option>
                        <option value="edited">
                            Last Edited
                        </option>
                    </select>
                </div>
            </div>

            {filteredDrafts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No drafts yet
                    </h2>
                    <p className="mt-2 text-sm text-secondary">
                        Start a new draft from Compose.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredDrafts.map(
                        (draft) => {
                            const isEditing =
                                editingId ===
                                draft.id;

                            return (
                                <div
                                    key={
                                        draft.id
                                    }
                                    className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 transition hover:border-primary"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <Link
                                            href={`/compose?draft=${draft.id}`}
                                            className="flex-1"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    {isEditing ? (
                                                        <input
                                                            autoFocus
                                                            value={
                                                                editingTitle
                                                            }
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                setEditingTitle(
                                                                    e
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={async () => {
                                                                setEditingId(
                                                                    null,
                                                                );
                                                                await renameDraft(
                                                                    draft.id,
                                                                    editingTitle.trim() ||
                                                                    "Untitled Draft",
                                                                );
                                                            }}
                                                            onKeyDown={async (
                                                                e,
                                                            ) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                ) {
                                                                    e.currentTarget.blur();
                                                                }

                                                                if (
                                                                    e.key ===
                                                                    "Escape"
                                                                ) {
                                                                    setEditingId(
                                                                        null,
                                                                    );
                                                                }
                                                            }}
                                                            className="w-full rounded-lg border border-primary bg-surface px-3 py-2 text-lg font-semibold outline-none"
                                                        />
                                                    ) : (
                                                        <h2
                                                            onDoubleClick={(
                                                                e,
                                                            ) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setEditingId(
                                                                    draft.id,
                                                                );
                                                                setEditingTitle(
                                                                    draft.title ??
                                                                    "Untitled Draft",
                                                                );
                                                            }}
                                                            className="truncate text-lg font-semibold"
                                                        >
                                                            {draft.title ??
                                                                "Untitled Draft"}
                                                        </h2>
                                                    )}

                                                    <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-secondary">
                                                        {draft.text ||
                                                            "No content yet."}
                                                    </p>
                                                </div>
                                            </div>

                                            {draft.media
                                                .length >
                                                0 && (
                                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                                        {draft.media
                                                            .slice(
                                                                0,
                                                                3,
                                                            )
                                                            .map(
                                                                (
                                                                    media,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            media.id
                                                                        }
                                                                        className="aspect-square overflow-hidden rounded-xl border border-outline-variant bg-surface-container"
                                                                    >
                                                                        {media.type ===
                                                                            "VIDEO" ? (
                                                                            <video
                                                                                src={
                                                                                    media.url
                                                                                }
                                                                                className="h-full w-full object-cover"
                                                                                muted
                                                                                playsInline
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={
                                                                                    media.url
                                                                                }
                                                                                alt=""
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                )}

                                            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-secondary">
                                                <span>
                                                    Created{" "}
                                                    {formatDate(
                                                        draft.createdAt,
                                                    )}{" "}
                                                    at{" "}
                                                    {formatTime(
                                                        draft.createdAt,
                                                    )}
                                                </span>
                                                <span>
                                                    •
                                                </span>
                                                <span>
                                                    Updated{" "}
                                                    {formatDate(
                                                        draft.updatedAt,
                                                    )}{" "}
                                                    at{" "}
                                                    {formatTime(
                                                        draft.updatedAt,
                                                    )}
                                                </span>
                                                <span>
                                                    •
                                                </span>
                                                <span>
                                                    {getPreviewCount(
                                                        draft,
                                                    )}{" "}
                                                    media
                                                </span>
                                            </div>

                                        </Link>

                                        <div className="flex shrink-0 flex-col gap-2">
                                            <button
                                                onClick={() =>
                                                    duplicateDraft(
                                                        draft.id,
                                                    )
                                                }
                                                disabled={
                                                    busyId ===
                                                    draft.id
                                                }
                                                className="rounded-lg border border-outline-variant px-3 py-2 text-sm transition hover:bg-surface-container-low disabled:opacity-50"
                                            >
                                                Duplicate
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteTarget(
                                                        draft,
                                                    );
                                                }}
                                                disabled={
                                                    busyId ===
                                                    draft.id
                                                }
                                                className="rounded-lg border border-error px-3 py-2 text-sm text-error transition hover:bg-error/10 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface p-6 shadow-xl">
                        <h3 className="text-xl font-semibold">
                            Delete draft?
                        </h3>
                        <p className="mt-2 text-sm text-secondary">
                            This will permanently remove{" "}
                            <span className="font-medium text-on-surface">
                                {deleteTarget.title ??
                                    "Untitled Draft"}
                            </span>
                            .
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null,
                                    )
                                }
                                className="rounded-lg border border-outline-variant px-4 py-2 text-sm transition hover:bg-surface-container-low"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    deleteDraft(
                                        deleteTarget.id,
                                    )
                                }
                                className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}