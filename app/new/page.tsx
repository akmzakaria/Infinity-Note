'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchCategories } from '@/lib/categories-api'
import { authenticatedFetch } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import {
  getOfflineNotes,
  getOfflineNotesByCategory,
  getOfflineCategories,
  saveOfflineNote,
  updateOfflineNote,
  deleteOfflineNote,
} from '@/lib/offline-storage'

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
  const [isOffline, setIsOffline] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef(title)
  const contentRef = useRef(content)
  const noteIdRef = useRef(noteId)

  // Keep refs in sync with state
  useEffect(() => {
    titleRef.current = title
    contentRef.current = content
    noteIdRef.current = noteId
  }, [title, content, noteId])

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (user) {
          // User is logged in - fetch from server
          const userCategories = await fetchCategories()
          setCategories(userCategories)
        } else {
          // User is offline - use localStorage
          const offlineCategories = getOfflineCategories()
          setCategories(offlineCategories)
          setIsOffline(true)
        }

        const fromQuery = searchParams.get('category')
        if (fromQuery && categories.includes(fromQuery)) {
          setCategory(fromQuery)
        } else {
          setCategory('All')
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to offline categories
        const offlineCategories = getOfflineCategories()
        setCategories(offlineCategories)
        setIsOffline(true)
        setCategory('All')
      }
    }

    loadCategories()
  }, [user, searchParams, categories])

  const createNoteOnline = useCallback(async () => {
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

  const updateNoteOnline = useCallback(
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

  const saveNoteOffline = useCallback(() => {
    // For new notes, don't create if completely empty
    if (!noteId && !title.trim() && !content.trim()) return null

    if (!noteId) {
      // Create new offline note
      const newNote = saveOfflineNote({
        title: title.trim() || 'Untitled',
        content: content.trim(),
        category,
      })
      return newNote.id
    } else {
      // Update existing offline note (allow empty content)
      updateOfflineNote(noteId, {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        category,
      })
      return noteId
    }
  }, [title, content, category, noteId])

  const debouncedSave = useCallback(async () => {
    // If existing note becomes completely empty, delete it
    if (noteId && !title.trim() && !content.trim()) {
      try {
        if (user && !isOffline) {
          // Delete from server
          await authenticatedFetch(`/api/notes/${noteId}`, { method: 'DELETE' })
        } else {
          // Delete from offline storage
          deleteOfflineNote(noteId)
        }
        // Navigate back to home
        window.history.back()
      } catch (error) {
        console.error('Error deleting note:', error)
      }
      return
    }

    // Only skip save if this is a new note with no content
    if (!noteId && !title.trim() && !content.trim()) return

    setSaving(true)
    try {
      if (user && !isOffline) {
        // Online mode - save to server
        if (!noteId) {
          const newNoteId = await createNoteOnline()
          if (newNoteId) {
            setNoteId(newNoteId)
          }
        } else {
          await updateNoteOnline(noteId)
        }
      } else {
        // Offline mode - save to localStorage
        const savedNoteId = saveNoteOffline()
        if (savedNoteId && !noteId) {
          setNoteId(savedNoteId)
        }
      }
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }, [title, content, noteId, user, isOffline, createNoteOnline, updateNoteOnline, saveNoteOffline])

  // Real-time saving with debouncing
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Always trigger save if noteId exists (editing existing note)
    // For new notes, only save if there's content
    if (noteId || title.trim() || content.trim()) {
      saveTimeoutRef.current = setTimeout(() => {
        debouncedSave()
      }, 1000) // Save after 1 second of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, category, noteId, debouncedSave])

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 md:flex md:items-center md:justify-center md:p-8">
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

              {isOffline && (
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span className="hidden md:inline">Offline</span>
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

export default function NewNote() {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-1 min-h-dvh items-center justify-center p-12"
          style={{ backgroundColor: '#0c1327' }}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
        </div>
      }
    >
      <NewNoteContent />
    </Suspense>
  )
}
