'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Note {
  _id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

interface NotesContextType {
  notesCache: Map<string, Note>
  notesByCategory: Map<string, Note[]>
  setNoteInCache: (note: Note) => void
  getNoteFromCache: (id: string) => Note | undefined
  setNotesByCategory: (category: string, notes: Note[]) => void
  getNotesByCategory: (category: string) => Note[] | undefined
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notesCache] = useState(() => new Map<string, Note>())
  const [notesByCategory] = useState(() => new Map<string, Note[]>())

  const setNoteInCache = (note: Note) => {
    notesCache.set(note._id, note)
  }

  const getNoteFromCache = (id: string) => {
    return notesCache.get(id)
  }

  const setNotesByCategory = (category: string, notes: Note[]) => {
    notesByCategory.set(category, notes)
  }

  const getNotesByCategory = (category: string) => {
    return notesByCategory.get(category)
  }

  return (
    <NotesContext.Provider
      value={{
        notesCache,
        notesByCategory,
        setNoteInCache,
        getNoteFromCache,
        setNotesByCategory,
        getNotesByCategory,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotesCache() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotesCache must be used within NotesProvider')
  }
  return context
}
