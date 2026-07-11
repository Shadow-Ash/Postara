export default function DashboardPage() {
  return (
    <section className="flex h-full items-center justify-center rounded-2xl border border-dashed border-outline-variant">

      <div className="text-center">

        <h1 className="mb-3 text-h1 font-bold">
          Welcome to Postara
        </h1>

        <a
          href="/api/auth/linkedin/login"
        >
          Connect LinkedIn
        </a>

        <p className="text-body text-secondary">
          Compose, Draft and Schedule your content.
        </p>

      </div>

    </section>
  );
}