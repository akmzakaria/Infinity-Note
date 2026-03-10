// Offline storage utilities for localStorage
export interface OfflineNote {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
  synced: boolean
}

export interface OfflineCategory {
  name: string
  synced: boolean
}

const NOTES_KEY = 'offline_notes'
const CATEGORIES_KEY = 'offline_categories'

// Notes management
export function getOfflineNotes(): OfflineNote[] {
  if (typeof window === 'undefined') return []

  try {
    const notes = localStorage.getItem(NOTES_KEY)
    return notes ? JSON.parse(notes) : []
  } catch (error) {
    console.error('Error reading offline notes:', error)
    return []
  }
}

export function saveOfflineNote(
  note: Omit<OfflineNote, 'id' | 'createdAt' | 'updatedAt' | 'synced'>
): OfflineNote {
  const notes = getOfflineNotes()
  const now = new Date().toISOString()

  const newNote: OfflineNote = {
    ...note,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    synced: false,
  }

  notes.push(newNote)
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  return newNote
}

export function updateOfflineNote(
  id: string,
  updates: Partial<Pick<OfflineNote, 'title' | 'content' | 'category'>>
): OfflineNote | null {
  const notes = getOfflineNotes()
  const noteIndex = notes.findIndex((note) => note.id === id)

  if (noteIndex === -1) return null

  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
    synced: false,
  }

  notes[noteIndex] = updatedNote
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  return updatedNote
}

export function deleteOfflineNote(id: string): boolean {
  const notes = getOfflineNotes()
  const filteredNotes = notes.filter((note) => note.id !== id)

  if (filteredNotes.length === notes.length) return false

  localStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes))
  return true
}

export function getOfflineNoteById(id: string): OfflineNote | null {
  const notes = getOfflineNotes()
  return notes.find((note) => note.id === id) || null
}

export function getOfflineNotesByCategory(category: string): OfflineNote[] {
  const notes = getOfflineNotes()
  if (category === 'All') return notes
  return notes.filter((note) => note.category === category)
}

// Categories management
export function getOfflineCategories(): string[] {
  if (typeof window === 'undefined') return ['All']

  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    const parsed = categories ? JSON.parse(categories) : []
    return ['All', ...parsed.map((cat: OfflineCategory) => cat.name)]
  } catch (error) {
    console.error('Error reading offline categories:', error)
    return ['All']
  }
}

export function saveOfflineCategory(name: string): boolean {
  if (name === 'All') return false

  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    const parsed: OfflineCategory[] = categories ? JSON.parse(categories) : []

    if (parsed.some((cat) => cat.name === name)) return false

    parsed.push({ name, synced: false })
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(parsed))
    return true
  } catch (error) {
    console.error('Error saving offline category:', error)
    return false
  }
}

export function deleteOfflineCategory(name: string): boolean {
  if (name === 'All') return false

  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    const parsed: OfflineCategory[] = categories ? JSON.parse(categories) : []
    const filtered = parsed.filter((cat) => cat.name !== name)

    if (filtered.length === parsed.length) return false

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting offline category:', error)
    return false
  }
}

// Sync utilities
export function markNoteAsSynced(id: string): void {
  const notes = getOfflineNotes()
  const noteIndex = notes.findIndex((note) => note.id === id)

  if (noteIndex !== -1) {
    notes[noteIndex].synced = true
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }
}

export function markCategoryAsSynced(name: string): void {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    const parsed: OfflineCategory[] = categories ? JSON.parse(categories) : []
    const categoryIndex = parsed.findIndex((cat) => cat.name === name)

    if (categoryIndex !== -1) {
      parsed[categoryIndex].synced = true
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(parsed))
    }
  } catch (error) {
    console.error('Error marking category as synced:', error)
  }
}

export function getUnsyncedNotes(): OfflineNote[] {
  return getOfflineNotes().filter((note) => !note.synced)
}

export function getUnsyncedCategories(): string[] {
  try {
    const categories = localStorage.getItem(CATEGORIES_KEY)
    const parsed: OfflineCategory[] = categories ? JSON.parse(categories) : []
    return parsed.filter((cat) => !cat.synced).map((cat) => cat.name)
  } catch (error) {
    console.error('Error getting unsynced categories:', error)
    return []
  }
}

export function clearOfflineData(): void {
  localStorage.removeItem(NOTES_KEY)
  localStorage.removeItem(CATEGORIES_KEY)
}

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
