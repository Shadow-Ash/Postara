import "../styles/globals.css"

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
                {children}
            </body>
        </html>
    )
}