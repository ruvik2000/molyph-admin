'use client'

import { useState } from 'react'

/**
 * VendorPreview — an in-panel phone mockup that renders a vendor the way a
 * consumer sees it in the MoLyph app (banner → profile head → stats → tabs).
 * Purely presentational; the admin page derives the data from Supabase and
 * passes it in. Styled in the app's dark-purple palette (not the slate admin
 * theme) so it reads as a real device preview.
 */

export interface VendorPreviewData {
  name: string
  category: string | null
  description: string | null
  address: string | null
  logoUrl: string | null
  bannerUrl: string | null
  tags: string[]
  rating: number | null
  reviewCount: number
  startingFrom: number | null
  eventCount: number
  gallery: string[]
  events: {
    id: string
    title: string
    dateLabel: string
    isTicketed: boolean
    price: number | null
    imageUrl: string | null
  }[]
  reviews: { id: string; author: string; rating: number | null; body: string; dateLabel: string }[]
}

type Tab = 'about' | 'events' | 'reviews'

const rupees = (n: number | null) => (n == null ? '—' : `Rs. ${Math.round(n).toLocaleString('en-LK')}`)

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(value) ? '#F5C518' : 'rgba(255,255,255,0.25)', fontSize: size }}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function VendorPreview({ data }: { data: VendorPreviewData }) {
  const [tab, setTab] = useState<Tab>('about')
  const rating = data.rating ?? 0

  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Consumer preview</p>
      <p className="mb-3 text-xs text-slate-400">How this vendor appears to users in the app.</p>

      {/* Phone frame */}
      <div
        className="mx-auto overflow-hidden rounded-[36px] border-2 shadow-2xl"
        style={{ width: 372, borderColor: 'rgba(123,79,255,0.35)', background: '#09001E' }}
      >
        <div className="h-[720px] overflow-y-auto text-white" style={{ background: '#09001E' }}>
          {/* Banner */}
          <div className="relative h-[168px] w-full">
            {data.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.bannerUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" style={{ background: 'linear-gradient(135deg,#3a1d5c,#1a0d3e)' }} />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,0,30,0.4), rgba(9,0,30,0.1), #09001E)' }} />
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-sm">‹</span>
              <div className="flex gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-xs">↗</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-sm">♡</span>
              </div>
            </div>
          </div>

          {/* Profile head */}
          <div className="-mt-11 flex flex-col items-center px-5">
            <div className="mb-3 h-[84px] w-[84px] rounded-full p-[3px]" style={{ background: '#09001E' }}>
              {data.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logoUrl} alt="" className="h-full w-full rounded-full object-cover" style={{ border: '2px solid #9B7FFF' }} />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full text-lg font-extrabold"
                  style={{ background: '#7B4FFF', border: '2px solid #9B7FFF' }}
                >
                  {initials(data.name)}
                </div>
              )}
            </div>

            <h3 className="text-[20px] font-extrabold tracking-tight">{data.name}</h3>
            {data.category && <p className="mt-0.5 text-[13px]" style={{ color: '#A89EC0' }}>{data.category}</p>}

            <div className="mt-2 flex items-center gap-2 text-[12px]" style={{ color: '#A89EC0' }}>
              <span className="inline-flex items-center gap-1">
                <span style={{ color: '#F5C518' }}>★</span>
                {rating ? rating.toFixed(1) : '—'} ({data.reviewCount})
              </span>
              {data.address && (
                <>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
                  <span className="inline-flex items-center gap-1">📍 <span className="max-w-[150px] truncate">{data.address}</span></span>
                </>
              )}
            </div>

            {/* Stats */}
            <div
              className="mt-4 flex w-full rounded-2xl py-3"
              style={{ background: '#1A0D3E', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Stat label="Events" value={`${data.eventCount}`} />
              <Divider />
              <Stat label="From" value={rupees(data.startingFrom)} />
              <Divider />
              <Stat label="Reviews" value={`${data.reviewCount}`} />
            </div>

            {/* Actions */}
            <div className="mt-3.5 flex w-full gap-2">
              <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-bold" style={{ background: '#7B4FFF' }}>
                💬 Message
              </div>
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full" style={{ background: 'rgba(123,79,255,0.15)', border: '1px solid rgba(123,79,255,0.3)' }}>📞</div>
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full" style={{ background: 'rgba(123,79,255,0.15)', border: '1px solid rgba(123,79,255,0.3)' }}>🔖</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-4 border-b px-5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {(['about', 'events', 'reviews'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="pb-2.5 pt-2 text-[13px] font-semibold"
                style={{
                  color: tab === t ? '#fff' : '#A89EC0',
                  borderBottom: `2px solid ${tab === t ? '#7B4FFF' : 'transparent'}`,
                }}
              >
                {t === 'about' ? 'About' : t === 'events' ? `Events (${data.events.length})` : `Reviews (${data.reviews.length})`}
              </button>
            ))}
          </div>

          <div className="px-5 py-4">
            {tab === 'about' && (
              <>
                <p className="text-[14px] leading-[22px]" style={{ color: '#A89EC0' }}>
                  {data.description || 'No description provided yet.'}
                </p>
                {data.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.tags.map((t) => (
                      <span key={t} className="rounded-full px-2.5 py-1 text-[11px]" style={{ background: 'rgba(123,79,255,0.15)', color: '#9B7FFF' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {data.gallery.length > 0 && (
                  <>
                    <p className="mb-2.5 mt-4 text-[15px] font-bold">Gallery</p>
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {data.gallery.map((g, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={g} alt="" className="h-[104px] w-[104px] shrink-0 rounded-xl object-cover" />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === 'events' && (
              <div className="space-y-2.5">
                {data.events.length === 0 && <p className="text-[13px]" style={{ color: '#A89EC0' }}>No events from this vendor yet.</p>}
                {data.events.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#1A0D3E', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {ev.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ev.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    ) : (
                      <div className="h-14 w-14 rounded-xl" style={{ background: 'linear-gradient(135deg,#3a1d5c,#1a0d3e)' }} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold">{ev.title}</p>
                      <p className="mt-0.5 text-[12px]" style={{ color: '#A89EC0' }}>{ev.dateLabel}</p>
                      <p className="mt-1 text-[13px] font-bold" style={{ color: '#9B7FFF' }}>
                        {ev.isTicketed ? rupees(ev.price) : 'Free'}
                      </p>
                    </div>
                    <span style={{ color: '#6B6080' }}>›</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: '#1A0D3E', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[36px] font-extrabold">{rating ? rating.toFixed(1) : '—'}</span>
                  <div>
                    <Stars value={rating} size={14} />
                    <p className="mt-1 text-[11px]" style={{ color: '#A89EC0' }}>Based on {data.reviewCount} reviews</p>
                  </div>
                </div>
                {data.reviews.length === 0 && <p className="text-[13px]" style={{ color: '#A89EC0' }}>No reviews yet.</p>}
                {data.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl p-3.5" style={{ background: '#1A0D3E', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold" style={{ background: 'rgba(123,79,255,0.2)', color: '#9B7FFF' }}>
                        {(r.author || '?')[0].toUpperCase()}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold">{r.author}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <Stars value={r.rating ?? 0} size={11} />
                          <span className="text-[10px]" style={{ color: '#6B6080' }}> · {r.dateLabel}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] leading-[19px]" style={{ color: '#A89EC0' }}>{r.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky-style CTA */}
          <div className="sticky bottom-0 flex items-center gap-3 px-5 py-3.5" style={{ background: '#0B0224', borderTop: '1px solid rgba(123,79,255,0.15)' }}>
            <div className="flex-1">
              <p className="text-[11px]" style={{ color: '#A89EC0' }}>Starting from</p>
              <p className="text-[18px] font-extrabold">{rupees(data.startingFrom)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full px-4 py-3 text-[14px] font-bold" style={{ background: '#7B4FFF' }}>
              Request Quote →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, hidden }: { label: string; value: string; hidden?: boolean }) {
  if (hidden) return null
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <span className="text-[15px] font-extrabold">{value}</span>
      <span className="text-[11px]" style={{ color: '#A89EC0' }}>{label}</span>
    </div>
  )
}

function Divider() {
  return <span style={{ width: 1, height: 30, alignSelf: 'center', background: 'rgba(255,255,255,0.08)' }} />
}
