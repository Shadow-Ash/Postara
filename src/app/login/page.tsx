"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function login() {
        setLoading(true);
        setError("");

        const response =
            await fetch(
                "/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        password,
                    }),
                },
            );

        if (!response.ok) {
            setLoading(false);
            setError(
                "Incorrect password",
            );
            return;
        }

        window.location.href = "/";
    }

    useEffect(() => {
        const handler = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key === "Enter"
            ) {
                login();
            }
        };

        window.addEventListener(
            "keydown",
            handler,
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handler,
            );
    }, [password]);

    useEffect(() => {

        fetch("/api/session")
            .then(r => r.json())
            .then(data => {

                if (data.authenticated) {

                    window.location.href = "/";

                }

            });

    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">

            <div className="w-full max-w-md rounded-3xl border border-outline-variant bg-surface-container-lowest p-10 shadow-sm">

                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">

                    <Lock
                        className="text-primary"
                        size={36}
                    />

                </div>

                <h1 className="text-center text-3xl font-semibold">
                    Postara
                </h1>

                <p className="mt-2 text-center text-sm text-on-surface-variant">
                    Private Dashboard
                </p>

                <input
                    autoFocus
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value,
                        )
                    }
                    className="mt-8 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary"
                />

                {error && (
                    <p className="mt-3 text-sm text-error">
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    onClick={login}
                    className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-on-primary transition hover:opacity-90 disabled:opacity-50"
                >
                    {loading
                        ? "Signing in..."
                        : "Continue"}
                </button>

            </div>

        </div>
    );
}