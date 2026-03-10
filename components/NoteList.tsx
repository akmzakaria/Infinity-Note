'use client';

import Link from 'next/link';

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
      <div className="flex flex-1 items-center justify-center p-12 text-[1.1rem] text-neutral-400">
        <p>No notes found. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 md:grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-6 md:p-8 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] lg:gap-8">
      {notes.map((note) => (
        <div
          key={note._id}
          className="group relative cursor-pointer rounded-xl border border-neutral-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md md:p-6"
        >
          <Link href={`/note/${note._id}`} className="block text-inherit no-underline">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="m-0 flex-1 text-xl font-semibold text-neutral-900">
                {note.title || 'Untitled'}
              </h3>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-medium text-neutral-600">
                  {formatTime(note.updatedAt)}
                </span>
                <span className="text-xs text-neutral-400">{formatDate(note.updatedAt)}</span>
              </div>
            </div>
            <p className="m-0 text-base leading-relaxed text-neutral-600">
              {truncateContent(note.content)}
            </p>
          </Link>
          <button
            className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 md:bottom-5 md:right-5"
            onClick={(e) => {
              e.preventDefault();
              if (confirm('Are you sure you want to delete this note?')) {
                onDelete(note._id);
              }
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
  );
}

