import { prisma } from "@/lib/prisma";

export async function AccountPanel() {
    const accounts = await prisma.connectedAccount.findMany({
        orderBy: {
            isActive: "desc",
        },
    });

    return (
        <aside className="w-80 shrink-0 border-l border-outline-variant bg-surface p-6">

            <h2 className="mb-6 text-xl font-semibold">
                Connected Accounts
            </h2>

            <div className="space-y-3">

                {accounts.map((account) => (

                    <form
                        key={account.id}
                        action="/api/accounts/switch"
                        method="POST"
                    >

                        <input
                            type="hidden"
                            name="accountId"
                            value={account.id}
                        />

                        <button
                            className={`w-full rounded-xl border p-4 text-left transition ${account.isActive
                                    ? "border-primary bg-primary/5"
                                    : "border-outline-variant hover:bg-surface-container"
                                }`}
                        >

                            <div className="flex gap-3">

                                <img
                                    src={account.avatar ?? ""}
                                    alt=""
                                    className="h-12 w-12 rounded-full"
                                />

                                <div>

                                    <p className="font-semibold">
                                        {account.displayName}
                                    </p>

                                    <p className="text-sm uppercase text-secondary">
                                        {account.platform}
                                    </p>

                                </div>

                            </div>

                        </button>

                    </form>

                ))}

            </div>

            <a
                href="/api/auth/linkedin/login"
                className="mt-5 block rounded-xl border border-dashed border-primary p-4 text-center font-medium"
            >
                + Add Account
            </a>

        </aside>
    );
}