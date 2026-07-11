"use client";

import { FileText, PenSquare, CalendarDays } from "lucide-react";

const items = [
    {
        name: "Compose",
        icon: PenSquare,
    },
    {
        name: "Drafts",
        icon: FileText,
    },
    {
        name: "Scheduled",
        icon: CalendarDays,
    },
];

export function Sidebar() {
    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-outline-variant bg-surface p-5">

            <div className="mb-10 flex gap-2">

                <button className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white">
                    X
                </button>

                <button className="rounded-lg border border-outline-variant px-5 py-2 text-sm">
                    LinkedIn
                </button>

            </div>

            <nav className="flex flex-col gap-4">

                {items.map(({ name, icon: Icon }) => (
                    <button
                        key={name}
                        className="flex items-center gap-3 rounded-xl border border-outline-variant bg-white px-5 py-4 text-left transition hover:border-primary hover:bg-primary/5"
                    >
                        <Icon size={20} />

                        {name}
                    </button>
                ))}

            </nav>

        </aside>
    );
}