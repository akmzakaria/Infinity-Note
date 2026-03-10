'use client';

import { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NoteList from '@/components/NoteList';
import Link from 'next/link';
import { loadCategories, saveCategories } from '@/lib/categories';
import { useRouter, useSearchParams } from 'next/navigation';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchSeq = useRef(0);

  useEffect(() => {
    const currentSeq = ++fetchSeq.current;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      try {
        const url =
          selectedCategory === 'All'
            ? '/api/notes'
            : `/api/notes?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        // Only apply the latest request result.
        if (fetchSeq.current === currentSeq) setNotes(data);
      } catch (error) {
        // Ignore abort errors (category changed quickly).
        if ((error as any)?.name !== 'AbortError') {
          console.error('Error fetching notes:', error);
        }
      } finally {
        if (fetchSeq.current === currentSeq) setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [selectedCategory, refreshKey]);

  useEffect(() => {
    const initial = loadCategories();
    setCategories(initial);
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const fromQuery = searchParams.get('category');
    if (fromQuery && categories.includes(fromQuery) && fromQuery !== selectedCategory) {
      setSelectedCategory(fromQuery);
      return;
    }
    // If URL category is missing/invalid, keep current selection.
  }, [searchParams, categories, selectedCategory]);

  useEffect(() => {
    if (categories.length === 0) return;
    saveCategories(categories);
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    router.replace(`/?category=${encodeURIComponent(category)}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="relative flex min-h-dvh bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        onCategoriesChange={setCategories}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-slate-800"
            aria-label="Profile"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </header>

        <NoteList
          notes={notes}
          loading={loading}
          onDelete={handleDeleteNote}
        />

        <Link
          href={`/new?category=${encodeURIComponent(selectedCategory)}`}
          className="fixed bottom-8 right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 text-white shadow-lg shadow-blue-500/40 transition-transform hover:scale-110 hover:shadow-xl hover:shadow-emerald-400/40 md:right-[calc(2rem+280px)] lg:right-[calc((100%-1200px)/2+2rem)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  );
}

