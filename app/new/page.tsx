'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchCategories } from '@/lib/categories-api'
import ProtectedRoute from '@/components/ProtectedRoute'
import { authenticatedFetch } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'

function NewNoteContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [saving, setSaving] = useState(false)
  const [noteId, setNoteId] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user) return

    const loadUserCategories = async () => {
      try {
        const userCategories = await fetchCategories()
        setCategories(userCategories)

        const fromQuery = searchParams.get('category')
        if (fromQuery && userCategories.includes(fromQuery)) {
          setCategory(fromQuery)
        } else {
          setCategory('All')
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories(['All'])
        setCategory('All')
      }
    }

    loadUserCategories()
  }, [user, searchParams])

  const createNote = useCallback(async () => {
    if (!title.trim() && !content.trim()) return null

    try {
      const res = await authenticatedFetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim() || 'Untitled',
          content: content.trim(),
          category,
        }),
      })

      if (res.ok) {
        const note = await res.json()
        return note._id
      } else {
        throw new Error('Failed to create note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      return null
    }
  }, [title, content, category])

  const updateNote = useCallback(
    async (id: string) => {
      try {
        const res = await authenticatedFetch(`/api/notes/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title.trim() || 'Untitled',
            content: content.trim(),
            category,
          }),
        })

        if (!res.ok) {
          throw new Error('Failed to update note')
        }
      } catch (error) {
        console.error('Error updating note:', error)
      }
    },
    [title, content, category]
  )

  const debouncedSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) return

    setSaving(true)
    try {
      if (!noteId) {
        // Create new note
        const newNoteId = await createNote()
        if (newNoteId) {
          setNoteId(newNoteId)
          // Don't redirect - keep user on the new note page
          // The note is now created and will be updated in place
        }
      } else {
        // Update existing note
        await updateNote(noteId)
      }
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }, [title, content, noteId, createNote, updateNote])

  // Real-time saving with debouncing
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (title.trim() || content.trim()) {
      saveTimeoutRef.current = setTimeout(() => {
        debouncedSave()
      }, 1000) // Save after 1 second of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, category, debouncedSave])

  return (
    <ProtectedRoute>
      <div className="min-h-dvh bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 md:flex md:items-center md:justify-center md:p-8">
        <div className="flex min-h-dvh w-full flex-col bg-slate-900/80 backdrop-blur md:min-h-[700px] md:max-w-[900px] md:rounded-xl md:shadow-xl md:shadow-black/40 md:ring-1 md:ring-slate-800/70">
          <div className="border-b border-slate-800/70 px-4 py-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-w-[200px] flex-1 bg-transparent text-2xl font-semibold text-slate-50 outline-none placeholder:font-normal placeholder:text-slate-400"
              />

              <div className="flex items-center gap-3">
                {saving && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-slate-400"></div>
                    <span className="hidden md:inline">Saving...</span>
                  </div>
                )}

                <div className="relative">
                  <button
                    className="whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-slate-50"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    Category: {category}
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[180px] overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl shadow-black/60">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          className={[
                            'w-full border-b border-slate-800 px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-slate-800',
                            category === cat
                              ? 'bg-sky-500/20 font-semibold text-sky-300'
                              : 'text-slate-300',
                          ].join(' ')}
                          onClick={() => {
                            setCategory(cat)
                            setShowCategoryDropdown(false)
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[420px] flex-1 resize-none bg-transparent px-4 py-4 text-base leading-relaxed text-slate-100 outline-none placeholder:text-slate-400 md:min-h-[520px] md:p-6"
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function NewNote() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-100">
          Loading...
        </div>
      }
    >
      <NewNoteContent />
    </Suspense>
  )
}
