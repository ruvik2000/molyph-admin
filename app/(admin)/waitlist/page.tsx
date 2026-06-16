import Link from 'next/link'
import { adminSupabase } from '@/lib/supabase/admin'

type WaitlistEntry = {
  id: string
  waitlist_type: string | null
  email?: string | null
  name?: string | null
  full_name?: string | null
  phone?: string | null
  company?: string | null
  created_at?: string | null
  [key: string]: unknown
}

type WaitlistFilter = 'all' | 'vendor' | 'user'

async function getWaitlist() {
  const { data, error } = await adminSupabase
    .from('landing_vendor_waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading waitlist for admin', error)
    return []
  }

  return (data ?? []) as WaitlistEntry[]
}

function displayName(entry: WaitlistEntry) {
  return entry.name ?? entry.full_name ?? '—'
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const entries = await getWaitlist()

  const filter: WaitlistFilter =
    searchParams.type === 'vendor' || searchParams.type === 'user'
      ? searchParams.type
      : 'all'

  const vendorCount = entries.filter((e) => e.waitlist_type === 'vendor').length
  const userCount = entries.filter((e) => e.waitlist_type === 'user').length

  const filtered =
    filter === 'all' ? entries : entries.filter((e) => e.waitlist_type === filter)

  const tabs: { key: WaitlistFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: entries.length },
    { key: 'vendor', label: 'Vendors', count: vendorCount },
    { key: 'user', label: 'Users', count: userCount },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-slate-50">Waitlist</h2>
        <p className="mt-1 text-sm text-slate-400">
          People who signed up via the landing page, split by vendors and users.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Signups</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{entries.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Vendors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{vendorCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Users</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{userCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.key === filter
          const href = tab.key === 'all' ? '/waitlist' : `/waitlist?type=${tab.key}`
          return (
            <Link
              key={tab.key}
              href={href}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                {tab.count}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/70">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                  No waitlist signups found.
                </td>
              </tr>
            )}
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3 align-middle text-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{displayName(entry)}</span>
                    {entry.company && (
                      <span className="text-xs text-slate-500">{entry.company}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">{entry.email ?? '—'}</td>
                <td className="px-4 py-3 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      entry.waitlist_type === 'vendor'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : entry.waitlist_type === 'user'
                          ? 'bg-sky-500/15 text-sky-300'
                          : 'bg-slate-700/40 text-slate-300'
                    }`}
                  >
                    {entry.waitlist_type ?? 'unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleString('en-GB')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
