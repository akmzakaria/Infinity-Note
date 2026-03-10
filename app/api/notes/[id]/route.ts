import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Note from '@/models/Note'
import { getAuthenticatedUser } from '@/lib/auth-middleware'

// Prevent this route from being processed during build
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()
    const { id } = await params

    const note = await Note.findOne({ _id: id, userId: user.uid })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const { title, content, category } = body

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: user.uid },
      {
        title: title || 'Untitled',
        content: content || '',
        category: category || 'All',
      },
      {
        new: true,
        runValidators: true,
        timestamps: false, // Prevent updatedAt from being updated
      }
    )

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error updating note:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    await connectDB()
    const { id } = await params

    const note = await Note.findOneAndDelete({ _id: id, userId: user.uid })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
