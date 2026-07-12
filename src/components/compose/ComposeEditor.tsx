"use client";

import type {
    Content,
    Media,
} from "@prisma/client";

import {
    CalendarDays,
    ImagePlus,
    Send,
    Video,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type Draft =
    (Content & {
        media: Media[];
    }) | null;

type Props = {
    account: {
        id: string;
        displayName: string;
        avatar: string | null;
        platform: string;
    };

    draft: Draft;
};

const LINKEDIN_LIMIT = 3000;

export function ComposeEditor({
    account,
    draft,
}: Props) {
    const [text, setText] = useState(
        draft?.text ?? "",
    );

    const [draftId, setDraftId] =
        useState<string | null>(
            draft?.id ?? null,
        );

    const [media, setMedia] =
        useState<
            {
                id: string;
                url: string;
                type: string;
            }[]
        >(
            draft?.media.map((m) => ({
                id: m.id,
                url: m.url,
                type: m.type,
            })) ?? [],
        );

    const [saving, setSaving] =
        useState(false);
    const [dragging, setDragging] =
        useState(false);

    const textareaRef =
        useRef<HTMLTextAreaElement>(null);
    const fileInput =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!draftId) return;

        const timeout = setTimeout(async () => {
            setSaving(true);

            try {
                await fetch(
                    `/api/drafts/${draftId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            title: "",
                            text,
                        }),
                    },
                );
            } finally {
                setSaving(false);
            }
        }, 800);

        return () =>
            clearTimeout(timeout);
    }, [text, draftId]);

    async function saveDraft() {
        if (draftId) return;

        setSaving(true);

        try {
            const response =
                await fetch(
                    "/api/drafts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            title: "",
                            text,
                        }),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to create draft",
                );
            }

            const created =
                await response.json();

            setDraftId(created.id);

            setMedia(
                created.media?.map(
                    (m: Media) => ({
                        id: m.id,
                        url: m.url,
                        type: m.type,
                    }),
                ) ?? [],
            );
        } finally {
            setSaving(false);
        }
    }

    async function uploadImage(
        file: File,
    ) {
        if (!draftId) {
            alert(
                "Save the draft first.",
            );
            return;
        }

        const form =
            new FormData();

        form.append(
            "file",
            file,
        );

        form.append(
            "draftId",
            draftId,
        );

        const response =
            await fetch(
                "/api/media/upload",
                {
                    method: "POST",
                    body: form,
                },
            );

        if (!response.ok) {
            return;
        }

        const uploaded =
            await response.json();

        setMedia((previous) => [
            ...previous,
            {
                id: uploaded.id,
                url: uploaded.url,
                type: uploaded.type,
            },
        ]);
    }

    async function removeMedia(
        id: string,
    ) {
        await fetch(
            `/api/media/${id}`,
            {
                method: "DELETE",
            },
        );

        setMedia((previous) =>
            previous.filter(
                (m) => m.id !== id,
            ),
        );
    }

    function resize() {
        if (!textareaRef.current)
            return;

        textareaRef.current.style.height =
            "0px";

        textareaRef.current.style.height =
            `${textareaRef.current.scrollHeight}px`;
    }

    const remaining = useMemo(
        () =>
            LINKEDIN_LIMIT -
            text.length,
        [text],
    );

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col">
            <div className="mb-8 flex items-center gap-4">
                <img
                    src={account.avatar ?? ""}
                    alt=""
                    className="h-14 w-14 rounded-full border"
                />

                <div>
                    <h1 className="text-xl font-semibold">
                        {account.displayName}
                    </h1>

                    <p className="text-sm text-secondary">
                        {account.platform}
                    </p>
                </div>
            </div>

            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() =>
                    setDragging(false)
                }
                onDrop={async (event) => {
                    event.preventDefault();

                    setDragging(false);

                    const files =
                        Array.from(
                            event
                                .dataTransfer
                                .files,
                        );

                    for (const file of files) {
                        await uploadImage(file);
                    }
                }}
                className={`rounded-2xl border bg-surface-container-lowest p-6 transition ${dragging
                        ? "border-primary border-dashed bg-primary/5"
                        : "border-outline-variant"
                    }`}
            >
                {dragging && (
                    <div className="mb-6 rounded-xl border-2 border-dashed border-primary bg-primary/5 p-8 text-center">
                        <p className="text-lg font-semibold text-primary">
                            Drop Images or Videos
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                            Release to upload.
                        </p>
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => {
                        setText(
                            e.target.value,
                        );
                        resize();
                    }}
                    placeholder="What's on your mind?"
                    className="min-h-[240px] w-full resize-none border-none bg-transparent text-lg outline-none"
                />

                {media.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-xl border"
                            >
                                <button
                                    onClick={() =>
                                        removeMedia(
                                            item.id,
                                        )
                                    }
                                    className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 transition group-hover:opacity-100"
                                >
                                    ✕
                                </button>

                                {item.type ===
                                    "VIDEO" ? (
                                    <video
                                        src={item.url}
                                        controls
                                        className="aspect-square w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        className="aspect-square w-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mb-5 mt-5 flex justify-end">
                    <span className="text-sm text-secondary">
                        {saving
                            ? "Saving..."
                            : draftId
                                ? "Saved"
                                : "Not Saved"}
                    </span>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex gap-3">
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            ref={fileInput}
                            onChange={async (e) => {
                                const file =
                                    e.target
                                        .files?.[0];

                                if (!file)
                                    return;

                                await uploadImage(
                                    file,
                                );
                            }}
                        />

                        <button
                            onClick={() =>
                                fileInput.current?.click()
                            }
                            className="rounded-lg border border-outline-variant p-3"
                        >
                            <ImagePlus
                                size={18}
                            />
                        </button>

                        <button className="rounded-lg border border-outline-variant p-3">
                            <Video
                                size={18}
                            />
                        </button>
                    </div>

                    <div className="flex items-center gap-5">
                        <span
                            className={`text-sm ${remaining <
                                100
                                ? "text-red-500"
                                : "text-secondary"}`}
                        >
                            {remaining}
                        </span>

                        <button
                            onClick={
                                saveDraft
                            }
                            disabled={
                                !!draftId
                            }
                            className="flex items-center gap-2 rounded-lg border border-outline-variant px-5 py-3 transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Save Draft
                        </button>

                        <button className="flex items-center gap-2 rounded-lg border border-outline-variant px-5 py-3 transition hover:bg-surface-container-low">
                            <CalendarDays
                                size={18}
                            />
                            Schedule
                        </button>

                        <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-on-primary transition hover:opacity-90">
                            <Send
                                size={18}
                            />
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}