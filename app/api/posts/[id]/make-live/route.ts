import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import { ADMIN_EMAIL } from '@/lib/config'

// POST - Make a post live (admin only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    // Only admin can make posts live
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

    // First, set all posts to not live
    await Post.updateMany({ authorEmail: ADMIN_EMAIL }, { $set: { isCurrentlyLive: false } })

    // Then set this post as live and published
    post.isCurrentlyLive = true
    post.isPublished = true
    if (!post.publishedAt) {
      post.publishedAt = new Date()
    }
    await post.save()

    return NextResponse.json({ message: 'Post is now live', post })
  } catch (error) {
    console.error('Error making post live:', error)
    return NextResponse.json({ error: 'Failed to make post live' }, { status: 500 })
  }
}
