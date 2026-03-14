import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import { ADMIN_EMAIL } from '@/lib/config'

// GET - Fetch single post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    // Only admin can fetch posts
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Verify the post belongs to the admin
    if (post.authorEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PATCH - Update post
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    // Only admin can update posts
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, isPublished } = body

    await connectDB()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Verify the post belongs to the admin
    if (post.authorEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prepare update object
    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished
      // Set publishedAt when first published
      if (isPublished && !post.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    // Update without changing timestamps
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      {
        new: true, // Return the updated document
        timestamps: false, // Don't update timestamps
      }
    )

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    // Only admin can delete posts
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Verify the post belongs to the admin
    if (post.authorEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await Post.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
