"use client"

import Link from "next/link"
import { LayoutDashboard, PenSquare, CalendarDays, BarChart3, Library } from "lucide-react"
import clsx from "clsx"

const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Editor",
        href: "/editor",
        icon: PenSquare
    },
    {
        name: "Schedule",
        href: "/schedule",
        icon: CalendarDays
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3
    },
    {
        name: "Library",
        href: "/library",
        icon: Library
    }
]

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-border bg-white dark:bg-slate-card flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-border">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                    P
                </div>

                <span className="font-semibold text-lg tracking-tight">
                    Postara
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                "text-slate-600 hover:bg-slate-100",
                                "dark:text-slate-400 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

        </aside>
    )
}