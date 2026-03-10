import { authenticatedFetch } from './api'
import {
  getUnsyncedNotes,
  getUnsyncedCategories,
  markNoteAsSynced,
  markCategoryAsSynced,
  clearOfflineData,
} from './offline-storage'

export async function syncOfflineDataToServer(): Promise<{ success: boolean; error?: string }> {
  try {
    // Sync categories first
    const unsyncedCategories = getUnsyncedCategories()
    for (const categoryName of unsyncedCategories) {
      try {
        const res = await authenticatedFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: categoryName }),
        })

        if (res.ok) {
          markCategoryAsSynced(categoryName)
        } else {
          console.error(`Failed to sync category: ${categoryName}`)
        }
      } catch (error) {
        console.error(`Error syncing category ${categoryName}:`, error)
      }
    }

    // Sync notes
    const unsyncedNotes = getUnsyncedNotes()
    for (const note of unsyncedNotes) {
      try {
        const res = await authenticatedFetch('/api/notes', {
          method: 'POST',
          body: JSON.stringify({
            title: note.title,
            content: note.content,
            category: note.category,
          }),
        })

        if (res.ok) {
          markNoteAsSynced(note.id)
        } else {
          console.error(`Failed to sync note: ${note.title}`)
        }
      } catch (error) {
        console.error(`Error syncing note ${note.title}:`, error)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error during sync:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function shouldShowSyncPrompt(): boolean {
  const unsyncedNotes = getUnsyncedNotes()
  const unsyncedCategories = getUnsyncedCategories()
  return unsyncedNotes.length > 0 || unsyncedCategories.length > 0
}
