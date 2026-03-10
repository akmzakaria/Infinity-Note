import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import { getAuthenticatedUser } from '@/lib/auth-middleware'

// Prevent this route from being processed during build
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()

    const categories = await Category.find({ userId: user.uid }).sort({ name: 1 })

    // Always include "All" as the first category
    const categoryNames = ['All', ...categories.map((cat) => cat.name)]

    return NextResponse.json(categoryNames)
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()

    const body = await request.json()
    const { name } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()

    // Don't allow creating "All" category
    if (trimmedName === 'All') {
      return NextResponse.json({ error: 'Cannot create "All" category' }, { status: 400 })
    }

    const category = await Category.create({
      name: trimmedName,
      userId: user.uid,
      userEmail: user.email || '',
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Handle duplicate category name
    if ((error as any).code === 11000) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()

    const body = await request.json()
    const { name } = body

    if (!name || name === 'All') {
      return NextResponse.json({ error: 'Cannot delete "All" category' }, { status: 400 })
    }

    const category = await Category.findOneAndDelete({ name, userId: user.uid })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
