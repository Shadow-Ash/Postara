"use client";

export function AccountPanel() {
    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-l border-outline-variant bg-surface p-6">

            <div className="mx-auto mb-6 h-24 w-24 rounded-full border-2 border-outline-variant" />

            <button className="rounded-xl border border-outline-variant bg-white py-3 font-medium transition hover:border-primary hover:bg-primary/5">
                Switch Accounts
            </button>

        </aside>
    );
}