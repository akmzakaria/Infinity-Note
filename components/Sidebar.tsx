'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
  selectedCategory,
  onCategorySelect,
}: SidebarProps) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const deletableCategories = useMemo(
    () => categories.filter((c) => c !== 'All'),
    [categories]
  );

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
  };

  const handleNewCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.includes(name)) {
      setNewCategoryName('');
      setShowNewCategory(false);
      return;
    }

    onCategoriesChange([...categories, name]);
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const handleDeleteCategory = (category: string) => {
    if (category === 'All') return;
    const ok = confirm(`Delete category "${category}"? Notes will remain, but may not show under this filter.`);
    if (!ok) return;

    const next = categories.filter((c) => c !== category);
    onCategoriesChange(next);

    if (selectedCategory === category) {
      onCategorySelect('All');
    }
  };

  return (
    <>
      <aside
        className={[
          'fixed left-0 top-0 z-[999] h-dvh w-[280px] overflow-y-auto border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-full flex-col gap-4 p-6">
          <Link
            href="/new"
            className="font-semibold text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-700"
            onClick={onClose}
          >
            <span>New</span>
          </Link>

          <div className="h-px bg-neutral-200" />

          <div className="flex-1">
            <h2 className="mb-2 font-semibold text-neutral-900 underline underline-offset-4">
              Category
            </h2>
            <div className="h-px bg-neutral-200" />
            
            <nav className="mt-3 flex flex-col gap-1">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-1">
                  <button
                    className={[
                      'flex-1 rounded-md px-4 py-3 text-left text-[16px] transition-colors',
                      selectedCategory === category
                        ? 'bg-blue-50 font-semibold text-blue-600'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                    ].join(' ')}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>

                  {category !== 'All' && deletableCategories.length > 0 && (
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
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

          <div className="h-px bg-neutral-200" />

          <button
            className="rounded-md px-4 py-3 text-left text-[16px] text-neutral-600 transition-colors hover:bg-neutral-100"
            onClick={() => setShowNewCategory(!showNewCategory)}
          >
            New Category
          </button>

          {showNewCategory && (
            <div className="flex flex-col gap-2 rounded-md bg-neutral-50 p-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-[14px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNewCategory();
                  }
                }}
              />
              <button
                onClick={handleNewCategory}
                className="rounded-md bg-blue-600 px-3 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

