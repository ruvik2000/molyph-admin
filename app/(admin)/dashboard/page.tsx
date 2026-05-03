import Link from 'next/link'
import { adminSupabase } from '@/lib/supabase/admin'

async function getDashboardCounts() {
  const [vendorsRes, eventsRes, onboardingRes] = await Promise.all([
    adminSupabase.from('vendors').select('id', { count: 'exact', head: true }),
    adminSupabase.from('events').select('id', { count: 'exact', head: true }),
    adminSupabase.from('onboarding_steps').select('id', { count: 'exact', head: true }),
  ])

  return {
    vendors: vendorsRes.count ?? 0,
    events: eventsRes.count ?? 0,
    onboardingSteps: onboardingRes.count ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const { vendors, events, onboardingSteps } = await getDashboardCounts()

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-slate-50">Overview</h2>
        <p className="mt-1 text-sm text-slate-400">
          High-level view of vendors and onboarding across the Molyph platform.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/vendors"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700 hover:bg-slate-900/80"
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Vendors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{vendors}</p>
          <p className="mt-1 text-xs text-slate-500">Onboarded vendors in the platform</p>
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Events</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{events}</p>
          <p className="mt-1 text-xs text-slate-500">Events created by vendors</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Onboarding Steps</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{onboardingSteps}</p>
          <p className="mt-1 text-xs text-slate-500">Total onboarding step records</p>
        </div>
      </div>
    </div>
  )
}
