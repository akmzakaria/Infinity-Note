'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadCategories } from '@/lib/categories';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
}

export default function EditNote() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Quran', 'Books']);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  useEffect(() => {
    setCategories(loadCategories());
  }, []);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}`);
      if (res.ok) {
        const note: Note = await res.json();
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
      } else {
        throw new Error('Failed to fetch note');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Failed to load note');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content');
      return;
    }

    setSaving(true);
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
      });

      if (res.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-100 p-4">
        <div className="text-[1.1rem] text-neutral-400">Loading note...</div>
      </div>
    );
  }

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

