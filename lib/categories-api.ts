import { authenticatedFetch } from './api'

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await authenticatedFetch('/api/categories')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return ['All'] // Fallback to default
  }
}

export async function createCategory(name: string): Promise<boolean> {
  try {
    const res = await authenticatedFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
    return res.ok
  } catch (error) {
    console.error('Error creating category:', error)
    return false
  }
}

export async function deleteCategory(name: string): Promise<boolean> {
  try {
    const res = await authenticatedFetch('/api/categories', {
      method: 'DELETE',
      body: JSON.stringify({ name }),
    })
    return res.ok
  } catch (error) {
    console.error('Error deleting category:', error)
    return false
  }
}
