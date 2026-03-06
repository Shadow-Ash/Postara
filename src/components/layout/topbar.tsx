"use client"

import { Bell } from "lucide-react"

export default function Topbar() {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-border flex items-center justify-between px-8 bg-white dark:bg-slate-card">

            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Dashboard
            </h1>

            <div className="flex items-center gap-4">

                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <Bell size={18} />
                </button>

                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    A
                </div>

            </div>

        </header>
    )
}