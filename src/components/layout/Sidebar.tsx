"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    CalendarDays,
    FileText,
    PenSquare,
    Settings,
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
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-outline-variant bg-surface">

            {/* Brand */}

            <div className="border-b border-outline-variant px-6 py-7">

                <h1 className="text-xl font-bold text-on-surface">
                    Postara
                </h1>

                <p className="mt-1 text-xs text-on-surface-variant">
                    Social Publishing
                </p>

            </div>

            {/* Platform Switch */}

            <div className="px-6 pt-6">

                <div className="flex rounded-full border border-outline-variant bg-surface-container-low p-1">

                    <button
                        className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:text-primary"
                    >
                        X
                    </button>

                    <button
                        className="flex-1 rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-primary shadow-sm"
                    >
                        LinkedIn
                    </button>

                </div>

            </div>

            {/* Navigation */}

            <nav className="mt-8 flex flex-1 flex-col gap-1 px-4">

                {items.map(
                    ({
                        name,
                        href,
                        icon: Icon,
                    }) => {

                        const active =
                            pathname === href;

                        return (

                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                                        ? "bg-primary/5 text-primary"
                                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                                    }`}
                            >

                                <Icon
                                    size={19}
                                    strokeWidth={2}
                                />

                                <span>
                                    {name}
                                </span>

                            </Link>

                        );
                    },
                )}

            </nav>

            {/* Footer */}

            <div className="border-t border-outline-variant p-4">

                <button
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
                >

                    <Settings
                        size={19}
                        strokeWidth={2}
                    />

                    Settings

                </button>

            </div>

        </aside>
    );
}