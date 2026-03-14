'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useToast } from './ToastProvider'

interface Note {
  _id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

interface NoteListProps {
  notes: Note[]
  loading: boolean
  onDelete: (id: string) => void
  searchQuery?: string
  currentCategory?: string
}

export default function NoteList({
  notes,
  loading,
  onDelete,
  searchQuery = '',
  currentCategory = 'All',
}: NoteListProps) {
  const { showToast } = useToast()
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null)
  const isViewerPostsCategory = currentCategory === "Today's Guidance"
  const isManagePostsCategory = currentCategory === 'Manage Posts'

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Check if notes match the current category type
  const notesMatchCategory = () => {
    if (notes.length === 0) return true

    const isPostsCategory = isManagePostsCategory || isViewerPostsCategory
    const firstNoteHasCategory = notes[0] && 'category' in notes[0] && notes[0].category

    // If we're in a posts category but notes have category field, they're stale notes
    if (isPostsCategory && firstNoteHasCategory) {
      return false
    }

    // If we're in a notes category but notes don't have category field, they're stale posts
    if (!isPostsCategory && !firstNoteHasCategory) {
      return false
    }

    return true
  }

  // Show loading spinner only when notes don't match the category type (not when just loading with valid cache)
  if (!notesMatchCategory()) {
    return (
      <div
        className="flex flex-1 items-center justify-center p-12"
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
      </div>
    )
  }

  if (notes.length === 0 && !loading) {
    return (
      <div
        className="flex flex-1 items-center justify-center p-12 text-[1.1rem] text-slate-400"
        style={{ backgroundColor: '#0c1327' }}
      >
        <p>
          {searchQuery.trim() ? 'No results matched' : 'No notes found. Create your first note!'}
        </p>
      </div>
    )
  }

  // Full-width display for viewer's posts
  if (isViewerPostsCategory && notes.length > 0) {
    return (
      <div
        className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8"
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-400 md:text-base">
              A new guidance will appear every 24 hours
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-lg shadow-black/40 md:p-8">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-100 md:text-lg">
                {notes[0].content}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`flex flex-1 flex-col gap-4 overflow-y-auto p-6 ${
          isManagePostsCategory
            ? 'md:gap-4 md:p-8'
            : 'md:grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-6 md:p-8 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] lg:gap-8'
        }`}
        style={{ backgroundColor: '#0c1327' }}
      >
        {notes.map((note) => (
          <div
            key={note._id}
            className="group relative cursor-pointer rounded-2xl border border-slate-800/60 bg-slate-900/80 p-5 shadow-sm shadow-black/40 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-lg md:p-6"
          >
            <Link
              href={`/note/${note._id}?from=${encodeURIComponent(currentCategory)}`}
              className="block text-inherit no-underline"
              prefetch={true}
            >
              {isManagePostsCategory ? (
                <>
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDate(note.updatedAt)}</span>
                    <span>•</span>
                    <span>{formatTime(note.updatedAt)}</span>
                  </div>
                  <p className="m-0 text-base leading-relaxed text-slate-300">
                    {truncateContent(note.content)}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="m-0 flex-1 text-xl font-semibold text-slate-50">
                      {note.title || 'Untitled'}
                    </h3>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-medium text-slate-300">
                        {formatTime(note.updatedAt)}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                  <p className="m-0 text-base leading-relaxed text-slate-300">
                    {truncateContent(note.content)}
                  </p>
                </>
              )}
            </Link>
            <button
              className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-md text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 md:bottom-5 md:right-5"
              onClick={(e) => {
                e.preventDefault()
                setPendingNoteId(note._id)
              }}
              aria-label="Delete note"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      {pendingNoteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 shadow-xl shadow-black/60">
            <h2 className="text-lg font-semibold text-slate-50">
              {isManagePostsCategory ? 'Delete this post?' : 'Delete this note?'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                className="rounded-md px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => setPendingNoteId(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
                onClick={() => {
                  const id = pendingNoteId
                  setPendingNoteId(null)
                  onDelete(id)
                  showToast({
                    variant: 'success',
                    title: isManagePostsCategory ? 'Post deleted' : 'Note deleted',
                  })
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
