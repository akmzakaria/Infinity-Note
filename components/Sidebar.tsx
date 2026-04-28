'use client'

import { useMemo, useState } from 'react'
import { useToast } from './ToastProvider'
import { useAuth } from './AuthProvider'
import Logo from './Logo'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''
const VIEWER_EMAIL = process.env.NEXT_PUBLIC_VIEWER_EMAIL || process.env.VIEWER_EMAIL || ''

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  onCategoriesChange: (categories: string[]) => void
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

export default function Sidebar({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
  selectedCategory,
  onCategorySelect,
}: SidebarProps) {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [pendingCategory, setPendingCategory] = useState<string | null>(null)
  const { showToast } = useToast()
  const { user } = useAuth()
  const deletableCategories = useMemo(() => categories.filter((c) => c !== 'All'), [categories])

  // Check if user is admin or viewer
  const isAdmin = user?.email === ADMIN_EMAIL
  const isViewer = user?.email === VIEWER_EMAIL

  // Add special categories based on user role
  const displayCategories = useMemo(() => {
    const allIndex = categories.indexOf('All')
    const newCategories = [...categories]

    if (isAdmin && !categories.includes('Manage Posts')) {
      newCategories.splice(allIndex + 1, 0, 'Manage Posts')
    }

    if (isViewer && !categories.includes("Today's Guidance")) {
      newCategories.splice(allIndex + 1, 0, "Today's Guidance")
    }

    return newCategories
  }, [categories, isAdmin, isViewer])

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category)
    onClose()
  }

  const handleNewCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    if (categories.includes(name)) {
      setNewCategoryName('')
      setShowNewCategory(false)
      return
    }

    onCategoriesChange([...categories, name])
    setNewCategoryName('')
    setShowNewCategory(false)
  }

  const handleDeleteCategory = (category: string) => {
    if (category === 'All') return
    setPendingCategory(category)
  }

  return (
    <>
      <aside
        className={[
          'fixed left-0 top-0 z-[999] h-dvh w-[280px] overflow-y-auto border-r border-slate-800/70 shadow-xl shadow-black/40 backdrop-blur transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
        style={{ backgroundColor: '#0c1327' }}
      >
        <div className="flex h-full flex-col gap-4 p-6">
          {/* Logo */}
          <Logo size="md" className="mb-2" />

          <div className="h-px bg-slate-800/80" />

          <div className="flex-1">
            <h2 className="mb-2 font-semibold text-slate-100">Categories</h2>
            <div className="h-px bg-slate-800/80" />

            <nav className="mt-3 flex flex-col gap-1">
              {displayCategories.map((category) => (
                <div key={category} className="flex items-center gap-1">
                  <button
                    className={[
                      'flex-1 rounded-md px-4 py-3 text-left text-[16px] transition-colors',
                      selectedCategory === category
                        ? 'bg-sky-500/20 font-semibold text-sky-300'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    ].join(' ')}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>

                  {category !== 'All' &&
                    category !== 'Manage Posts' &&
                    category !== "Today's Guidance" &&
                    deletableCategories.length > 0 && (
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => handleDeleteCategory(category)}
                        aria-label={`Delete category ${category}`}
                        title="Delete category"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    )}
                </div>
              ))}
            </nav>
          </div>

          <div className="h-px bg-slate-800/80" />

          <button
            className="rounded-md px-4 py-3 text-left text-[16px] text-slate-300 transition-colors hover:bg-slate-800"
            onClick={() => setShowNewCategory(!showNewCategory)}
          >
            New Category
          </button>

          {showNewCategory && (
            <div
              className="flex flex-col gap-2 rounded-md p-2"
              style={{ backgroundColor: '#0c1327' }}
            >
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                maxLength={20}
                className="rounded-md border border-slate-700 px-3 py-2 text-[14px] text-slate-50 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
                style={{ backgroundColor: '#0c1327' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewCategory()
                  }
                }}
              />
              <button
                onClick={handleNewCategory}
                className="rounded-md bg-sky-500 px-3 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-sky-400"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </aside>
      {pendingCategory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl shadow-black/60"
            style={{ backgroundColor: '#0c1327' }}
          >
            <h2 className="text-lg font-semibold text-slate-50">
              Delete category &quot;{pendingCategory}&quot;?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Notes will stay in the database but may not appear under this filter.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                className="rounded-md px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => setPendingCategory(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
                onClick={() => {
                  const cat = pendingCategory
                  setPendingCategory(null)
                  const next = categories.filter((c) => c !== cat)
                  onCategoriesChange(next)
                  if (selectedCategory === cat) {
                    onCategorySelect('All')
                  }
                  showToast({
                    variant: 'info',
                    title: 'Category deleted',
                    description: `"${cat}" was removed. Existing notes are unchanged.`,
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
