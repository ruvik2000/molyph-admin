import Link from 'next/link'
import { adminSupabase } from '@/lib/supabase/admin'

async function getVendors() {
  const { data, error } = await adminSupabase
    .from('vendors')
    .select('id,user_id,name,category,created_at,profile_views,event_saves,contact_email')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading vendors for admin', error)
    return []
  }

  return data ?? []
}

export default async function AdminVendorsPage() {
  const vendors = await getVendors()

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">Vendors</h2>
          <p className="mt-1 text-sm text-slate-400">
            Review onboarded vendors, their activity and performance at a glance.
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/70">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Profile Views
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                Event Saves
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {vendors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                  No vendors found yet.
                </td>
              </tr>
            )}
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3 align-middle text-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{vendor.name ?? 'Untitled vendor'}</span>
                    <span className="text-xs text-slate-500">ID: {vendor.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">
                  {vendor.category ?? '—'}
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">
                  {vendor.contact_email ?? '—'}
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">
                  {vendor.profile_views ?? 0}
                </td>
                <td className="px-4 py-3 align-middle text-slate-300">
                  {vendor.event_saves ?? 0}
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
