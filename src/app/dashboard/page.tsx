import AppLayout from "@/components/layout/app-layout"

export default function DashboardPage() {
    return (
        <AppLayout>

            <div className="max-w-5xl mx-auto space-y-6">

                <h2 className="text-2xl font-bold">
                    Welcome to Postara
                </h2>

                <p className="text-slate-500">
                    Schedule tweets, manage threads and automate your content pipeline.
                </p>

            </div>

        </AppLayout>
    )
}