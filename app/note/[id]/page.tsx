'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { loadCategories } from '@/lib/categories'
import { useToast } from '@/components/ToastProvider'

interface Note {
  _id: string
  title: string
  content: string
  category: string
}

export default function EditNote() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string
  const { showToast } = useToast()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('All')
  const [categories, setCategories] = useState(['All', 'Quran', 'Books'])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false)
  const [originalTitle, setOriginalTitle] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [originalCategory, setOriginalCategory] = useState('All')

  useEffect(() => {
    if (noteId) {
      fetchNote()
    }
  }, [noteId])

  useEffect(() => {
    setCategories(loadCategories())
  }, [])

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}`)
      if (res.ok) {
        const note: Note = await res.json()
        setTitle(note.title)
        setContent(note.content)
        setCategory(note.category)
        // Store original values for comparison
        setOriginalTitle(note.title)
        setOriginalContent(note.content)
        setOriginalCategory(note.category)
      } else {
        throw new Error('Failed to fetch note')
      }
    } catch (error) {
      console.error('Error fetching note:', error)
      showToast({
        variant: 'error',
        title: 'Failed to load note',
        description: 'Returning you to your notes list.',
      })
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      showToast({
        variant: 'warning',
        title: 'Nothing to save',
        description: 'Please add a title or some content before saving.',
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || 'Untitled',
          content: content.trim(),
          category,
        }),
      })

      if (res.ok) {
        showToast({
          variant: 'success',
          title: 'Note updated',
        })
        router.push(`/?category=${encodeURIComponent(category)}`)
      } else {
        throw new Error('Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      showToast({
        variant: 'error',
        title: 'Failed to update note',
        description: 'Please try again in a moment.',
      })
    } finally {
      setSaving(false)
    }
  }

  const hasUnsavedChanges = () => {
    return title !== originalTitle || content !== originalContent || category !== originalCategory
  }

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedAlert(true)
    } else {
      router.back()
    }
  }

  const handleDiscardChanges = () => {
    setShowUnsavedAlert(false)
    router.back()
  }

  const handleSaveAndExit = async () => {
    setShowUnsavedAlert(false)
    await handleSave()
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 p-4">
        <div className="text-[1.1rem] text-slate-400">Loading note...</div>
      </div>
    )
  }

  return (
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

        <textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[420px] flex-1 resize-none bg-transparent px-4 py-4 text-base leading-relaxed text-slate-100 outline-none placeholder:text-slate-400 md:min-h-[520px] md:p-6"
        />

        <div className="flex justify-end gap-3 border-t border-slate-800/70 px-4 py-4 md:gap-4 md:p-6">
          <button
            className="rounded-md px-5 py-3 text-base text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-base font-semibold text-white transition-all hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showUnsavedAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl shadow-black/60">
            <h2 className="text-lg font-semibold text-slate-50">Save your changes?</h2>
            <p className="mt-2 text-sm text-slate-400">
              You have unsaved changes. Would you like to save this note before leaving?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                onClick={() => setShowUnsavedAlert(false)}
              >
                Keep editing
              </button>
              <button
                className="rounded-md px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={handleDiscardChanges}
              >
                Discard
              </button>
              {/* <button
                className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-sky-400 hover:to-blue-500"
                onClick={handleSaveAndExit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
