import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { AccountPanel } from "./AccountPanel";

type AppShellProps = {
    children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="flex-1 px-10 py-8">
                {children}
            </main>

            <AccountPanel />
        </div>
    );
}