export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-slate-50">Overview</h2>
        <p className="mt-1 text-sm text-slate-400">
          High-level view of vendors and onboarding across the Molyph platform.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Vendors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">—</p>
          <p className="mt-1 text-xs text-slate-500">Coming soon – wired to Supabase metrics.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active Events</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">—</p>
          <p className="mt-1 text-xs text-slate-500">Placeholder for event analytics.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Onboarding Funnel</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">—</p>
          <p className="mt-1 text-xs text-slate-500">Future breakdown of vendor onboarding steps.</p>
        </div>
      </div>
    </div>
  )
}
