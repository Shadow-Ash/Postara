"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    CalendarDays,
    FileText,
    PenSquare,
} from "lucide-react";

const items = [
    {
        name: "Compose",
        href: "/compose",
        icon: PenSquare,
    },
    {
        name: "Drafts",
        href: "/drafts",
        icon: FileText,
    },
    {
        name: "Scheduled",
        href: "/scheduled",
        icon: CalendarDays,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-outline-variant bg-surface p-5">

            {/* Platform Switch */}

            <div className="mb-10 flex gap-2">

                <button
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-on-primary transition hover:opacity-90"
                >
                    X
                </button>

                <button
                    className="rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-2 text-sm font-medium text-on-surface transition hover:bg-surface-container-low"
                >
                    LinkedIn
                </button>

            </div>

            {/* Navigation */}

            <nav className="flex flex-col gap-4">

                {items.map(({ name, href, icon: Icon }) => {

                    const active = pathname === href;

                    return (

                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${active
                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                    : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-primary/5"
                                }`}
                        >

                            <Icon
                                size={20}
                                strokeWidth={2}
                            />

                            <span className="font-medium">
                                {name}
                            </span>

                        </Link>

                    );

                })}

            </nav>

        </aside>
    );
}