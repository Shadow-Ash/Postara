import Sidebar from "./sidebar"
import Topbar from "./topbar"

export default function AppLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden">

            <Sidebar />

            <div className="flex flex-col flex-1">

                <Topbar />

                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                    {children}
                </main>

            </div>

        </div>
    )
}