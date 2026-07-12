"use client";

import { LogOut } from "lucide-react";

type Props = {
    accountId: string;
    displayName: string;
};

export default function DisconnectButton({
    accountId,
    displayName,
}: Props) {
    return (
        <form
            action="/api/accounts/logout"
            method="POST"
        >
            <input
                type="hidden"
                name="accountId"
                value={accountId}
            />

            <button
                type="submit"
                onClick={(event) => {
                    const confirmed =
                        window.confirm(
                            `Disconnect "${displayName}"?\n\nThis will remove:\n• Drafts\n• Scheduled Posts\n• Uploaded Media`
                        );

                    if (!confirmed) {
                        event.preventDefault();
                    }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium text-error transition hover:bg-error-container"
            >
                <LogOut size={17} />

                Disconnect Account
            </button>
        </form>
    );
}