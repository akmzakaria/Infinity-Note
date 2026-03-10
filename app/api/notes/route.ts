import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Note from '@/models/Note'
import { getAuthenticatedUser } from '@/lib/auth-middleware'

// Prevent this route from being processed during build
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    let query: any = { userId: user.uid }
    if (category && category !== 'All') {
      query.category = category
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 })
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()

    const body = await request.json()
    const { title, content, category } = body

    if (!title && !content) {
      return NextResponse.json({ error: 'Title or content is required' }, { status: 400 })
    }

    const note = await Note.create({
      title: title || 'Untitled',
      content: content || '',
      category: category || 'All',
      userId: user.uid,
      userEmail: user.email || '',
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
