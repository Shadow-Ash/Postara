"use client";

import {
    LogOut,
    Loader2,
} from "lucide-react";

import {
    useState,
} from "react";

export default function LogoutButton() {

    const [loading, setLoading] =
        useState(false);

    async function logout() {

        const confirmed =
            window.confirm(
                "Logout from Postara?"
            );

        if (!confirmed)
            return;

        setLoading(true);

        await fetch(
            "/api/logout",
            {
                method: "POST",
            },
        );

        window.location.href =
            "/login";

    }

    return (

        <button
            onClick={logout}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface transition hover:bg-error-container hover:text-error disabled:opacity-60"
        >

            {loading ? (

                <Loader2
                    size={18}
                    className="animate-spin"
                />

            ) : (

                <LogOut
                    size={18}
                />

            )}

            {loading
                ? "Logging out..."
                : "Logout"}

        </button>

    );

}