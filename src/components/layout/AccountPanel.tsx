import { prisma } from "@/lib/prisma";

import { Check, Plus } from "lucide-react";

import DisconnectButton from "./DisconnectButton";
import LogoutButton from "./LogoutButton";

export async function AccountPanel() {
    const accounts =
        await prisma.connectedAccount.findMany({
            orderBy: {
                isActive: "desc",
            },
        });

    return (
        <aside className="flex h-screen w-[340px] shrink-0 flex-col border-l border-outline-variant bg-surface">

            {/* Header */}

            <div className="border-b border-outline-variant px-6 py-7">

                <h2 className="text-lg font-semibold text-on-surface">
                    Accounts
                </h2>

                <p className="mt-1 text-xs text-on-surface-variant">
                    Connected LinkedIn profiles
                </p>

            </div>

            {/* Accounts */}

            <div className="flex-1 overflow-y-auto px-4 py-5">

                <div className="space-y-2">

                    {accounts.map((account) => (

                        <div
                            key={account.id}
                            className={`rounded-xl transition-all duration-200 ${account.isActive
                                ? "bg-primary/5"
                                : "hover:bg-surface-container-low"
                                }`}
                        >

                            {/* Switch Account */}

                            <form
                                action="/api/accounts/switch"
                                method="POST"
                            >

                                <input
                                    type="hidden"
                                    name="accountId"
                                    value={account.id}
                                />

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-between rounded-xl px-3 py-3"
                                >

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={account.avatar ?? ""}
                                            alt=""
                                            className="h-11 w-11 rounded-full border border-outline-variant object-cover"
                                        />

                                        <div className="text-left">

                                            <p className="text-sm font-semibold text-on-surface">
                                                {account.displayName}
                                            </p>

                                            {account.needsReconnect && (

                                                <div className="mt-1 rounded-md bg-error-container px-2 py-1 text-[11px] font-medium text-error">

                                                    Reconnect LinkedIn

                                                </div>

                                            )}

                                            <p className="mt-0.5 text-xs uppercase text-on-surface-variant">
                                                {account.platform}
                                            </p>

                                        </div>

                                    </div>

                                    {account.isActive && (

                                        <span className="rounded-full bg-primary/10 p-1">

                                            <Check
                                                size={16}
                                                className="text-primary"
                                            />

                                        </span>

                                    )}

                                </button>

                            </form>

                            {/* Disconnect */}

                            {account.isActive && (

                                <div className="px-3 pb-3">

                                    <DisconnectButton
                                        accountId={account.id}
                                        displayName={account.displayName}
                                    />

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

            {/* Footer */}

            <div className="border-t border-outline-variant p-5">

                <a
                    href="/api/auth/linkedin/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary bg-surface-container-lowest px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                >

                    <Plus size={18} />

                    Add LinkedIn Account

                </a>

            </div>

            <LogoutButton />

        </aside>
    );
}