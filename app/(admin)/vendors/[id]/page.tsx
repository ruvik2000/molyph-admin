import { notFound } from 'next/navigation'
import { adminSupabase } from '@/lib/supabase/admin'

interface VendorPageProps {
  params: { id: string }
}

async function getVendorWithDetails(id: string) {
  const { data: vendor, error } = await adminSupabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error loading vendor details for admin', error)
  }

  if (!vendor) return null

  const { data: events } = await adminSupabase
    .from('events')
    .select('id,title,start_at,end_at,is_ticketed')
    .eq('vendor_id', id)
    .order('start_at', { ascending: false })

  const { data: reviews } = await adminSupabase
    .from('reviews')
    .select('id,reviewer_name,rating,body,created_at')
    .eq('vendor_id', id)
    .order('created_at', { ascending: false })

  return {
    vendor,
    events: events ?? [],
    reviews: reviews ?? [],
  }
}

export default async function AdminVendorDetailPage({ params }: VendorPageProps) {
  const data = await getVendorWithDetails(params.id)

  if (!data) {
    notFound()
  }

  const { vendor, events, reviews } = data

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 ring-2 ring-emerald-500/30" />
          <div>
            <h2 className="text-xl font-semibold text-slate-50">{vendor.name ?? 'Untitled vendor'}</h2>
            <p className="text-xs text-slate-400">ID: {vendor.id}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 max-w-2xl">
          {vendor.description ?? 'No description has been provided yet.'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span>
            Category: <span className="text-slate-100">{vendor.category ?? '—'}</span>
          </span>
          <span>
            Contact: <span className="text-slate-100">{vendor.contact_email ?? '—'}</span>
          </span>
          <span>
            Profile views: <span className="text-slate-100">{vendor.profile_views ?? 0}</span>
          </span>
          <span>
            Event saves: <span className="text-slate-100">{vendor.event_saves ?? 0}</span>
          </span>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200">Events</h3>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900/70">
                <tr>
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-400">
                    Title
                  </th>
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-400">
                    Start
                  </th>
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-400">
                    End
                  </th>
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-slate-400">
                    Ticketed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                      No events found for this vendor yet.
                    </td>
                  </tr>
                )}
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-900/60">
                    <td className="px-3 py-2 text-slate-100">{event.title}</td>
                    <td className="px-3 py-2 text-slate-300">
                      {new Date(event.start_at).toLocaleString('en-GB')}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {new Date(event.end_at).toLocaleString('en-GB')}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {event.is_ticketed ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Recent reviews</h3>
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            {reviews.length === 0 && (
              <p className="text-xs text-slate-500">No reviews for this vendor yet.</p>
            )}
            {reviews.map((review) => (
              <article key={review.id} className="rounded-lg bg-slate-900/80 px-3 py-2.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-100">{review.reviewer_name}</span>
                  <span className="text-slate-500">
                    {new Date(review.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{review.body}</p>
                {typeof review.rating === 'number' && (
                  <p className="mt-1 text-[11px] text-amber-400">Rating: {review.rating.toFixed(1)} / 5</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
