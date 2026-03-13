'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { fetchCategories } from '@/lib/categories-api'
import { useToast } from '@/components/ToastProvider'
import { authenticatedFetch } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import {
  getOfflineNoteById,
  updateOfflineNote,
  getOfflineCategories,
  deleteOfflineNote,
} from '@/lib/offline-storage'
import { useNotesCache } from '@/components/NotesProvider'
import { useCapacitor } from '@/hooks/useCapacitor'

// Prevent this page from being prerendered during build
export const dynamic = 'force-dynamic'

interface Note {
  _id: string
  title: string
  content: string
  category: string
}

export default function EditNote() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const noteId = params.id as string
  const fromCategory = searchParams.get('from') || 'All'
  const { user } = useAuth()
  const { showToast } = useToast()
  const { getNoteFromCache } = useNotesCache()
  const { isCapacitor } = useCapacitor()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [originalTitle, setOriginalTitle] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [originalCategory, setOriginalCategory] = useState('All')
  const [isOffline, setIsOffline] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef(title)
  const contentRef = useRef(content)

  // Keep refs in sync with state
  useEffect(() => {
    titleRef.current = title
    contentRef.current = content
  }, [title, content])

  // Handle click outside category dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false)
      }
    }

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategoryDropdown])

  const fetchNote = useCallback(async () => {
    // Try cache first for instant loading
    const cachedNote = getNoteFromCache(noteId)
    if (cachedNote) {
      setTitle(cachedNote.title)
      setContent(cachedNote.content)
      setCategory(cachedNote.category)
      setOriginalTitle(cachedNote.title)
      setOriginalContent(cachedNote.content)
      setOriginalCategory(cachedNote.category)
      setLoading(false)
    }

    try {
      if (user) {
        // Try to fetch from server first
        const res = await authenticatedFetch(`/api/notes/${noteId}`)
        if (res.ok) {
          const note: Note = await res.json()
          setTitle(note.title)
          setContent(note.content)
          setCategory(note.category)
          setOriginalTitle(note.title)
          setOriginalContent(note.content)
          setOriginalCategory(note.category)
          setLoading(false)
          return
        }
      }

      // Fallback to offline note
      const offlineNote = getOfflineNoteById(noteId)
      if (offlineNote) {
        setTitle(offlineNote.title)
        setContent(offlineNote.content)
        setCategory(offlineNote.category)
        setOriginalTitle(offlineNote.title)
        setOriginalContent(offlineNote.content)
        setOriginalCategory(offlineNote.category)
        setIsOffline(true)
      } else if (!cachedNote) {
        throw new Error('Note not found')
      }
    } catch (error) {
      if (!cachedNote) {
        console.error('Error fetching note:', error)
        showToast({
          variant: 'error',
          title: 'Failed to load note',
          description: 'Returning you to your notes list.',
        })
        router.push('/')
      }
    } finally {
      setLoading(false)
    }
  }, [noteId, user, showToast, router, getNoteFromCache])

  const loadCategories = useCallback(async () => {
    try {
      if (user && !isOffline) {
        const userCategories = await fetchCategories()
        setCategories(userCategories)
      } else {
        const offlineCategories = getOfflineCategories()
        setCategories(offlineCategories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      const offlineCategories = getOfflineCategories()
      setCategories(offlineCategories)
    }
  }, [user, isOffline])

  useEffect(() => {
    if (noteId) {
      fetchNote()
      loadCategories()
    }
  }, [fetchNote, noteId, loadCategories])

  const updateNote = useCallback(async () => {
    // If note becomes completely empty, delete it
    if (!title.trim() && !content.trim()) {
      try {
        if (user && !isOffline) {
          // Delete from server
          await authenticatedFetch(`/api/notes/${noteId}`, { method: 'DELETE' })
        } else {
          // Delete from offline storage
          deleteOfflineNote(noteId)
        }
        // Navigate back to the category we came from
        router.push(`/?category=${encodeURIComponent(fromCategory)}`)
      } catch (error) {
        console.error('Error deleting note:', error)
      }
      return
    }

    setSaving(true)
    try {
      if (user && !isOffline) {
        // Update on server
        const res = await authenticatedFetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title.trim() || 'Untitled',
            content: content.trim(),
            category,
          }),
        })

        if (res.ok) {
          setOriginalTitle(title.trim() || 'Untitled')
          setOriginalContent(content.trim())
          setOriginalCategory(category)
        } else {
          throw new Error('Failed to update note')
        }
      } else {
        // Update offline
        // Add small delay to show saving indicator
        await new Promise((resolve) => setTimeout(resolve, 300))
        const updatedNote = updateOfflineNote(noteId, {
          title: title.trim() || 'Untitled',
          content: content.trim(),
          category,
        })

        if (updatedNote) {
          setOriginalTitle(updatedNote.title)
          setOriginalContent(updatedNote.content)
          setOriginalCategory(updatedNote.category)
        }
      }
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setSaving(false)
    }
  }, [noteId, title, content, category, user, isOffline, router, fromCategory])

  const hasUnsavedChanges = useCallback(() => {
    return title !== originalTitle || content !== originalContent || category !== originalCategory
  }, [title, originalTitle, content, originalContent, category, originalCategory])

  // Real-time saving with debouncing
  useEffect(() => {
    if (loading) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (hasUnsavedChanges()) {
      saveTimeoutRef.current = setTimeout(() => {
        updateNote()
      }, 1000)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, category, hasUnsavedChanges, loading, updateNote])

  if (loading) {
    return (
      <div
        className={`flex flex-1 min-h-dvh items-center justify-center p-12 ${isCapacitor ? 'mt-5' : 'md:mt-0'}`}
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-dvh bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 md:flex md:items-center md:justify-center md:p-8 ${isCapacitor ? 'mt-5' : 'md:mt-0'}`}
    >
      <div className="flex min-h-dvh w-full flex-col bg-slate-900/80 backdrop-blur md:min-h-[700px] md:max-w-[900px] md:rounded-xl md:shadow-xl md:shadow-black/40 md:ring-1 md:ring-slate-800/70">
        <div className="border-b border-slate-800/70 px-4 py-4 md:p-6">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-slate-50 outline-none placeholder:font-normal placeholder:text-slate-400"
            />

            <div className="flex shrink-0 items-center gap-3">
              {saving && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-slate-400"></div>
                  <span className="hidden md:inline">Saving...</span>
                </div>
              )}

              <div className="relative" ref={categoryDropdownRef}>
                <button
                  className="whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-slate-50 md:px-4"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span className="hidden md:inline">Category: </span>
                  {category}
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

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-slate-800"
                onClick={async () => {
                  // Force save the note
                  await updateNote()
                  // Navigate back to the category we came from
                  router.push(`/?category=${encodeURIComponent(fromCategory)}`)
                }}
                title="Save and go back"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
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
  )
}
