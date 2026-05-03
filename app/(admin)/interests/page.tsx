'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Subcategory = {
  id: string
  category_id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  interest_subcategories?: Subcategory[]
}

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function AdminInterestsPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [subcategoryDrafts, setSubcategoryDrafts] = useState<Record<string, string>>({})

  const load = async () => {
    setLoading(true)
    setError('')
    const { data, error: loadError } = await supabase
      .from('interest_categories')
      .select(
        'id,name,slug,sort_order,is_active,interest_subcategories(id,category_id,name,slug,sort_order,is_active)'
      )
      .order('sort_order', { ascending: true })

    if (loadError) {
      setError(loadError.message)
      setLoading(false)
      return
    }

    const mapped =
      (data as Category[] | null)?.map((category) => ({
        ...category,
        interest_subcategories: [...(category.interest_subcategories ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order
        ),
      })) ?? []

    setItems(mapped)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const nextCategorySort = useMemo(() => {
    if (!items.length) return 1
    return Math.max(...items.map((c) => c.sort_order || 0)) + 1
  }, [items])

  const addCategory = async (event: FormEvent) => {
    event.preventDefault()
    const name = newCategoryName.trim()
    if (!name) return
    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('interest_categories').insert({
      name,
      slug: slugify(name),
      sort_order: nextCategorySort,
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setNewCategoryName('')
    await load()
    setSaving(false)
  }

  const addSubcategory = async (category: Category) => {
    const raw = (subcategoryDrafts[category.id] ?? '').trim()
    if (!raw) return
    setSaving(true)
    setError('')
    const nextSort =
      Math.max(0, ...(category.interest_subcategories ?? []).map((s) => s.sort_order || 0)) + 1

    const { error: insertError } = await supabase.from('interest_subcategories').insert({
      category_id: category.id,
      name: raw,
      slug: slugify(raw),
      sort_order: nextSort,
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setSubcategoryDrafts((prev) => ({ ...prev, [category.id]: '' }))
    await load()
    setSaving(false)
  }

  const renameCategory = async (category: Category) => {
    const nextName = prompt('Category name', category.name)?.trim()
    if (!nextName || nextName === category.name) return
    setSaving(true)
    setError('')
    const { error: updateError } = await supabase
      .from('interest_categories')
      .update({ name: nextName, slug: slugify(nextName) })
      .eq('id', category.id)
    if (updateError) setError(updateError.message)
    await load()
    setSaving(false)
  }

  const renameSubcategory = async (subcategory: Subcategory) => {
    const nextName = prompt('Subcategory name', subcategory.name)?.trim()
    if (!nextName || nextName === subcategory.name) return
    setSaving(true)
    setError('')
    const { error: updateError } = await supabase
      .from('interest_subcategories')
      .update({ name: nextName, slug: slugify(nextName) })
      .eq('id', subcategory.id)
    if (updateError) setError(updateError.message)
    await load()
    setSaving(false)
  }

  const toggleCategory = async (category: Category) => {
    setSaving(true)
    setError('')
    const { error: updateError } = await supabase
      .from('interest_categories')
      .update({ is_active: !category.is_active })
      .eq('id', category.id)
    if (updateError) setError(updateError.message)
    await load()
    setSaving(false)
  }

  const toggleSubcategory = async (subcategory: Subcategory) => {
    setSaving(true)
    setError('')
    const { error: updateError } = await supabase
      .from('interest_subcategories')
      .update({ is_active: !subcategory.is_active })
      .eq('id', subcategory.id)
    if (updateError) setError(updateError.message)
    await load()
    setSaving(false)
  }

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Delete "${category.name}" and all its subcategories?`)) return
    setSaving(true)
    setError('')
    const { error: deleteError } = await supabase
      .from('interest_categories')
      .delete()
      .eq('id', category.id)
    if (deleteError) setError(deleteError.message)
    await load()
    setSaving(false)
  }

  const deleteSubcategory = async (subcategory: Subcategory) => {
    if (!confirm(`Delete "${subcategory.name}"?`)) return
    setSaving(true)
    setError('')
    const { error: deleteError } = await supabase
      .from('interest_subcategories')
      .delete()
      .eq('id', subcategory.id)
    if (deleteError) setError(deleteError.message)
    await load()
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-slate-50">Interests Taxonomy</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage onboarding interests and event targeting categories used in mobile and web.
        </p>
      </header>

      <form
        onSubmit={addCategory}
        className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row"
      >
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add new category (e.g. Arts & Culture)"
          className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving || !newCategoryName.trim()}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Category
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-rose-800/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
          Loading taxonomy...
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((category) => (
            <section key={category.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{category.name}</h3>
                  <p className="text-xs text-slate-500">
                    slug: {category.slug} | order: {category.sort_order}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => renameCategory(category)}
                    className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:bg-rose-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-3 overflow-hidden rounded-md border border-slate-800">
                {(category.interest_subcategories ?? []).length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-500">No subcategories yet.</div>
                ) : (
                  (category.interest_subcategories ?? []).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm text-slate-200">{sub.name}</p>
                        <p className="text-xs text-slate-500">
                          slug: {sub.slug} | order: {sub.sort_order}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => renameSubcategory(sub)}
                          className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => toggleSubcategory(sub)}
                          className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                        >
                          {sub.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteSubcategory(sub)}
                          className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:bg-rose-900/40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={subcategoryDrafts[category.id] ?? ''}
                  onChange={(e) =>
                    setSubcategoryDrafts((prev) => ({ ...prev, [category.id]: e.target.value }))
                  }
                  placeholder={`Add subcategory under "${category.name}"`}
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  disabled={saving}
                />
                <button
                  onClick={() => addSubcategory(category)}
                  disabled={saving || !(subcategoryDrafts[category.id] ?? '').trim()}
                  className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add Subcategory
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
