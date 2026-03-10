'use client'

import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import NoteList from '@/components/NoteList'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { fetchCategories, createCategory, deleteCategory } from '@/lib/categories-api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/components/ToastProvider'
import { authenticatedFetch } from '@/lib/api'

interface Note {
  _id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const fetchSeq = useRef(0)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't fetch notes if user is not loaded yet
    if (!user) return

    const currentSeq = ++fetchSeq.current
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      try {
        const url =
          selectedCategory === 'All'
            ? '/api/notes'
            : `/api/notes?category=${encodeURIComponent(selectedCategory)}`
        const res = await authenticatedFetch(url, { signal: controller.signal })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        // Only apply the latest request result.
        if (fetchSeq.current === currentSeq) setNotes(data)
      } catch (error) {
        // Ignore abort errors (category changed quickly).
        if ((error as any)?.name !== 'AbortError') {
          console.error('Error fetching notes:', error)
          showToast({
            variant: 'error',
            title: 'Failed to load notes',
            description: 'Please try refreshing the page.',
          })
        }
      } finally {
        if (fetchSeq.current === currentSeq) setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [selectedCategory, refreshKey, user, showToast])

  // Fetch categories when user is loaded
  useEffect(() => {
    if (!user) return

    const loadCategories = async () => {
      setCategoriesLoading(true)
      try {
        const userCategories = await fetchCategories()
        setCategories(userCategories)
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories(['All']) // Fallback
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [user])

  useEffect(() => {
    if (categoriesLoading) return
    const fromQuery = searchParams.get('category')
    if (fromQuery && categories.includes(fromQuery) && fromQuery !== selectedCategory) {
      setSelectedCategory(fromQuery)
      return
    }
    // If URL category is missing/invalid, keep current selection.
  }, [searchParams, categories, selectedCategory, categoriesLoading])

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

  const handleCategoriesChange = async (newCategories: string[]) => {
    const oldCategories = categories
    setCategories(newCategories)

    // Find added categories
    const addedCategories = newCategories.filter(
      (cat) => !oldCategories.includes(cat) && cat !== 'All'
    )

    // Find removed categories
    const removedCategories = oldCategories.filter(
      (cat) => !newCategories.includes(cat) && cat !== 'All'
    )

    try {
      // Create new categories
      for (const categoryName of addedCategories) {
        const success = await createCategory(categoryName)
        if (!success) {
          showToast({
            variant: 'error',
            title: 'Failed to create category',
            description: `Could not create category "${categoryName}"`,
          })
          // Revert on failure
          setCategories(oldCategories)
          return
        }
      }

      // Delete removed categories
      for (const categoryName of removedCategories) {
        const success = await deleteCategory(categoryName)
        if (!success) {
          showToast({
            variant: 'error',
            title: 'Failed to delete category',
            description: `Could not delete category "${categoryName}"`,
          })
          // Revert on failure
          setCategories(oldCategories)
          return
        }
      }
    } catch (error) {
      console.error('Error updating categories:', error)
      setCategories(oldCategories) // Revert on error
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
      const res = await authenticatedFetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      setRefreshKey((k) => k + 1)
      showToast({
        variant: 'success',
        title: 'Note deleted',
        description: 'The note has been successfully deleted.',
      })
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
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      showToast({
        variant: 'error',
        title: 'Sign out failed',
        description: 'Please try again.',
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-dvh bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <main className="relative flex w-full flex-1 flex-col bg-slate-950/40 md:ml-[280px] md:w-[calc(100%-280px)] lg:mx-auto lg:max-w-[1200px] lg:pl-[280px]">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 px-6 py-4 backdrop-blur">
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

            <div className="flex-1"></div>

            {/* Profile Icon - Top-right corner with proper margin */}
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

              {/* Profile Dropdown */}
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
          </header>

          <NoteList notes={notes} loading={loading} onDelete={handleDeleteNote} />

          <Link
            href={`/new?category=${encodeURIComponent(selectedCategory)}`}
            className="fixed bottom-8 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 text-white shadow-lg shadow-blue-500/40 transition-transform hover:scale-110 hover:shadow-xl hover:shadow-emerald-400/40 md:bottom-16 md:right-[100px]"
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
      </div>
    </ProtectedRoute>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-100">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
