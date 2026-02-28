import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Molyph Admin',
  description: 'Admin console for managing vendors and onboardings',
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables for admin app.')
}

async function requireAdmin() {
  const cookieStore = cookies()

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email || !user.email.endsWith('@molyph.com')) {
    redirect('/login')
  }

  return user
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 border-r border-slate-800 bg-slate-950/80 px-5 py-6 md:block">
            <div className="mb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400 mb-1">
                Molyph
              </p>
              <h1 className="text-lg font-semibold text-slate-50">Admin Console</h1>
              <p className="mt-1 text-xs text-slate-500">Control panel for vendors and onboarding.</p>
            </div>

            <nav className="space-y-1 text-sm">
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-slate-50"
              >
                Overview
              </Link>
              <Link
                href="/vendors"
                className="block rounded-md px-3 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-slate-50"
              >
                Vendors
              </Link>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 md:px-6">
              <div className="flex items-center gap-2 md:hidden">
                <span className="h-6 w-6 rounded bg-emerald-500/90" />
                <span className="text-sm font-medium text-slate-100">Molyph Admin</span>
              </div>
              <p className="text-xs text-slate-500">Internal use only</p>
            </header>

            <div className="px-4 py-6 md:px-6 md:py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
