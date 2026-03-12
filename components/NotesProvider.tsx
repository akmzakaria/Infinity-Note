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
  setNoteInCache: (note: Note) => void
  getNoteFromCache: (id: string) => Note | undefined
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notesCache] = useState(() => new Map<string, Note>())

  const setNoteInCache = (note: Note) => {
    notesCache.set(note._id, note)
  }

  const getNoteFromCache = (id: string) => {
    return notesCache.get(id)
  }

  return (
    <NotesContext.Provider value={{ notesCache, setNoteInCache, getNoteFromCache }}>
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
