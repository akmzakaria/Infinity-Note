'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, loading, onDelete }: NoteListProps) {
  const { showToast } = useToast();
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-[1.1rem] text-neutral-400">
        <p>Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-[1.1rem] text-slate-400">
        <p>No notes found. Create your first note!</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 md:grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-6 md:p-8 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] lg:gap-8">
      {notes.map((note) => (
        <div
          key={note._id}
          className="group relative cursor-pointer rounded-2xl border border-slate-800/60 bg-slate-900/80 p-5 shadow-sm shadow-black/40 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-lg md:p-6"
        >
          <Link href={`/note/${note._id}`} className="block text-inherit no-underline">
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
          </Link>
          <button
            className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-md text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 md:bottom-5 md:right-5"
            onClick={(e) => {
              e.preventDefault();
              setPendingNoteId(note._id);
            }}
            aria-label="Delete note"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            Delete this note?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            This action cannot be undone.
          </p>
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
                const id = pendingNoteId;
                setPendingNoteId(null);
                onDelete(id);
                showToast({
                  variant: 'success',
                  title: 'Note deleted',
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

