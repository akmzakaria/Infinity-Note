'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadCategories } from '@/lib/categories';
import { useToast } from '@/components/ToastProvider';

export default function NewNote() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Quran', 'Books']);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loaded = loadCategories();
    setCategories(loaded);

    const fromQuery = searchParams.get('category');
    if (fromQuery && loaded.includes(fromQuery)) {
      setCategory(fromQuery);
    } else {
      setCategory('All');
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      showToast({
        variant: 'warning',
        title: 'Nothing to save',
        description: 'Please add a title or some content before saving.',
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || 'Untitled',
          content: content.trim(),
          category,
        }),
      });

      if (res.ok) {
        showToast({
          variant: 'success',
          title: 'Note created',
        });
        router.push(`/?category=${encodeURIComponent(category)}`);
      } else {
        throw new Error('Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showToast({
        variant: 'error',
        title: 'Failed to save note',
        description: 'Please try again in a moment.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white md:flex md:items-center md:justify-center md:bg-neutral-100 md:p-8">
      <div className="flex min-h-dvh w-full flex-col bg-white md:min-h-[700px] md:max-w-[900px] md:rounded-xl md:shadow-sm md:ring-1 md:ring-black/5">
        <div className="border-b border-neutral-200 px-4 py-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-w-[200px] flex-1 bg-transparent text-2xl font-semibold text-neutral-900 outline-none placeholder:font-normal placeholder:text-neutral-400"
            />
            
            <div className="relative">
              <button
                className="whitespace-nowrap rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-900 transition-colors hover:bg-neutral-200"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                Category: {category}
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[180px] overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={[
                        'w-full border-b border-neutral-100 px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-neutral-100',
                        category === cat ? 'bg-blue-50 font-semibold text-blue-600' : 'text-neutral-900',
                      ].join(' ')}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
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
          className="min-h-[420px] flex-1 resize-none px-4 py-4 text-base leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 md:min-h-[520px] md:p-6"
        />

        <div className="flex justify-end gap-3 border-t border-neutral-200 px-4 py-4 md:gap-4 md:p-6">
          <button
            className="rounded-md px-5 py-3 text-base text-neutral-600 transition-colors hover:bg-neutral-100"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

