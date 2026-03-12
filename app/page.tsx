'use client'

import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import NoteList from '@/components/NoteList'
import Link from 'next/link'
import { fetchCategories, createCategory, deleteCategory } from '@/lib/categories-api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/ToastProvider'
import { useNotesCache } from '@/components/NotesProvider'
import { authenticatedFetch } from '@/lib/api'
import {
  getOfflineNotes,
  getOfflineNotesByCategory,
  getOfflineCategories,
  saveOfflineCategory,
  deleteOfflineCategory,
  deleteOfflineNote,
} from '@/lib/offline-storage'
import { syncOfflineDataToServer, shouldShowSyncPrompt } from '@/lib/sync'

interface Note {
  _id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

interface OfflineNote {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
  synced: boolean
}

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const { setNoteInCache } = useNotesCache()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showSyncPrompt, setShowSyncPrompt] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fetchSeq = useRef(0)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
  })

  // Check if accessing base URL without category - redirect based on auth status
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return

    const category = searchParams.get('category')
    if (!category) {
      if (user) {
        // User is logged in - redirect to All category page
        router.push('/?category=All')
      } else {
        // User is not logged in - redirect to login page
        router.push('/login')
      }
      return
    }
  }, [router, searchParams, user, authLoading])

  useEffect(() => {
    const currentSeq = ++fetchSeq.current
    const controller = new AbortController()

    const run = async () => {
      // Get category directly from URL to avoid stale state
      const categoryFromUrl = searchParams.get('category')
      if (!categoryFromUrl) return

      setLoading(true)
      // Clear notes immediately to prevent flash of wrong category
      setNotes([])

      try {
        if (user) {
          // User is logged in - fetch from server
          const url =
            categoryFromUrl === 'All'
              ? '/api/notes'
              : `/api/notes?category=${encodeURIComponent(categoryFromUrl)}`
          const res = await authenticatedFetch(url, { signal: controller.signal })

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }

          const data = await res.json()
          if (fetchSeq.current === currentSeq) {
            setNotes(data)
            // Cache all notes
            data.forEach((note: Note) => setNoteInCache(note))
          }
        } else {
          // User is offline - use localStorage
          const offlineNotes =
            categoryFromUrl === 'All'
              ? getOfflineNotes()
              : getOfflineNotesByCategory(categoryFromUrl)

          // Convert offline notes to match the Note interface
          const convertedNotes = offlineNotes.map((note) => ({
            _id: note.id,
            title: note.title,
            content: note.content,
            category: note.category,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }))

          if (fetchSeq.current === currentSeq) {
            setNotes(convertedNotes)
            // Cache all notes
            convertedNotes.forEach((note) => setNoteInCache(note))
          }
        }
      } catch (error) {
        if ((error as any)?.name !== 'AbortError') {
          console.error('Error fetching notes:', error)
          // Fallback to offline notes
          const offlineNotes =
            categoryFromUrl === 'All'
              ? getOfflineNotes()
              : getOfflineNotesByCategory(categoryFromUrl)

          const convertedNotes = offlineNotes.map((note) => ({
            _id: note.id,
            title: note.title,
            content: note.content,
            category: note.category,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }))

          if (fetchSeq.current === currentSeq) {
            setNotes(convertedNotes)
            // Cache all notes
            convertedNotes.forEach((note) => setNoteInCache(note))
          }

          if (user) {
            showToast({
              variant: 'error',
              title: 'Failed to load notes',
              description: 'Showing offline notes instead.',
            })
          }
        }
      } finally {
        if (fetchSeq.current === currentSeq) setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [searchParams, refreshKey, user, showToast, setNoteInCache])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true)
      try {
        if (user) {
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
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [user])

  // Check for sync prompt when user logs in
  useEffect(() => {
    if (user && shouldShowSyncPrompt()) {
      setShowSyncPrompt(true)
    }
  }, [user])

  useEffect(() => {
    if (categoriesLoading) return
    const fromQuery = searchParams.get('category')
    if (fromQuery && categories.includes(fromQuery)) {
      setSelectedCategory(fromQuery)
    }
  }, [searchParams, categories, categoriesLoading])

  // Handle click outside profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const result = await syncOfflineDataToServer()
      if (result.success) {
        showToast({
          variant: 'success',
          title: 'Sync completed',
          description: 'Your offline notes have been synced to the cloud.',
        })
        setShowSyncPrompt(false)
        setRefreshKey((k) => k + 1) // Refresh the notes list
      } else {
        showToast({
          variant: 'error',
          title: 'Sync failed',
          description: result.error || 'Please try again.',
        })
      }
    } catch (error) {
      console.error('Sync error:', error)
      showToast({
        variant: 'error',
        title: 'Sync failed',
        description: 'Please try again.',
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleCategoriesChange = async (newCategories: string[]) => {
    const oldCategories = categories
    setCategories(newCategories)

    const addedCategories = newCategories.filter(
      (cat) => !oldCategories.includes(cat) && cat !== 'All'
    )

    const removedCategories = oldCategories.filter(
      (cat) => !newCategories.includes(cat) && cat !== 'All'
    )

    try {
      if (user) {
        // Online mode - sync with server
        for (const categoryName of addedCategories) {
          const success = await createCategory(categoryName)
          if (!success) {
            showToast({
              variant: 'error',
              title: 'Failed to create category',
              description: `Could not create category "${categoryName}"`,
            })
            setCategories(oldCategories)
            return
          }
        }

        for (const categoryName of removedCategories) {
          const success = await deleteCategory(categoryName)
          if (!success) {
            showToast({
              variant: 'error',
              title: 'Failed to delete category',
              description: `Could not delete category "${categoryName}"`,
            })
            setCategories(oldCategories)
            return
          }
        }
      } else {
        // Offline mode - save to localStorage
        for (const categoryName of addedCategories) {
          saveOfflineCategory(categoryName)
        }

        for (const categoryName of removedCategories) {
          deleteOfflineCategory(categoryName)
        }
      }
    } catch (error) {
      console.error('Error updating categories:', error)
      setCategories(oldCategories)
      showToast({
        variant: 'error',
        title: 'Failed to update categories',
        description: 'Please try again.',
      })
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    router.replace(`/?category=${encodeURIComponent(category)}`)
  }

  const handleDeleteNote = async (id: string) => {
    try {
      if (user) {
        // Online mode
        const res = await authenticatedFetch(`/api/notes/${id}`, { method: 'DELETE' })
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
      } else {
        // Offline mode
        deleteOfflineNote(id)
      }

      // Update local state by removing the deleted note
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id))

      // showToast({
      //   variant: 'success',
      //   title: 'Note deleted',
      //   description: 'The note has been successfully deleted.',
      // })
    } catch (error) {
      console.error('Error deleting note:', error)
      showToast({
        variant: 'error',
        title: 'Failed to delete note',
        description: 'Please try again.',
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      showToast({
        variant: 'success',
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      showToast({
        variant: 'error',
        title: 'Sign out failed',
        description: 'Please try again.',
      })
    }
  }

  // Don't render if no category parameter (redirecting to login)
  const category = searchParams.get('category')
  if (!category) {
    return (
      <div
        className="flex flex-1 min-h-dvh items-center justify-center p-12"
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-sky-400"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-dvh" style={{ backgroundColor: '#0c1327' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        onCategoriesChange={handleCategoriesChange}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <main
        className="relative flex w-full flex-1 flex-col md:ml-[280px] md:w-[calc(100%-280px)] lg:mx-auto lg:max-w-[1200px] lg:pl-[280px]"
        style={{ backgroundColor: '#0c1327' }}
      >
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800/60 px-6 py-4 backdrop-blur"
          style={{ backgroundColor: '#0c1327' }}
        >
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-slate-800 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center px-4">
            {user ? (
              <div className="w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2 pl-10 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
                  />
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <span className="md:inline">Working offline</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-100 transition-colors hover:bg-slate-700"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-12 z-[102] w-64 rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-xl">
                    <div className="mb-3 border-b border-slate-700 pb-3">
                      <p className="text-sm font-medium text-slate-100">{user?.displayName}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-100 transition-colors hover:bg-red-500/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-sky-400 hover:to-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        <NoteList
          notes={filteredNotes}
          loading={loading}
          onDelete={handleDeleteNote}
          searchQuery={searchQuery}
        />

        <Link
          href={`/new?category=${encodeURIComponent(selectedCategory)}`}
          className="fixed bottom-8 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 text-white shadow-lg shadow-blue-500/40 transition-transform hover:scale-110 hover:shadow-xl hover:shadow-emerald-400/40 md:bottom-16 md:right-[100px]"
          prefetch={true}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Link>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sync Prompt Modal */}
      {showSyncPrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl shadow-black/60">
            <h2 className="text-lg font-semibold text-slate-50">Sync your offline notes?</h2>
            <p className="mt-2 text-sm text-slate-400">
              You have notes saved offline. Would you like to sync them to your account?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                onClick={() => setShowSyncPrompt(false)}
              >
                Not now
              </button>
              <button
                className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
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
      <HomeContent />
    </Suspense>
  )
}
