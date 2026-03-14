import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import { ADMIN_EMAIL, VIEWER_EMAIL } from '@/lib/config'

// GET - Fetch posts
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    if (userEmail === ADMIN_EMAIL) {
      // Admin can see all their posts
      await connectDB()
      const posts = await Post.find({ authorEmail: ADMIN_EMAIL }).sort({ createdAt: -1 })

      // Calculate which post is currently being shown to viewers
      const publishedPosts = await Post.find({
        authorEmail: ADMIN_EMAIL,
        isPublished: true,
      }).sort({ publishedAt: 1 })

      let currentlyActivePostId = null

      if (publishedPosts.length > 0) {
        // First check if any post is manually set as live
        const manuallyLivePost = publishedPosts.find((post) => post.isCurrentlyLive)

        if (manuallyLivePost) {
          currentlyActivePostId = manuallyLivePost._id.toString()
        } else {
          // Fall back to automatic rotation
          const newestPublishedDate = new Date(
            publishedPosts[publishedPosts.length - 1].publishedAt
          ).getTime()
          const now = Date.now()
          const daysPassed = Math.floor((now - newestPublishedDate) / (1000 * 60 * 60 * 24))
          const currentPostIndex = publishedPosts.length - 1 - daysPassed

          if (currentPostIndex >= 0) {
            currentlyActivePostId = publishedPosts[currentPostIndex]._id.toString()
          }
        }
      }

      // Add currentlyActive flag to each post
      const postsWithActiveFlag = posts.map((post) => ({
        ...post.toObject(),
        currentlyActive: post._id.toString() === currentlyActivePostId,
      }))

      return NextResponse.json(postsWithActiveFlag)
    } else if (userEmail === VIEWER_EMAIL) {
      // Viewer sees only the currently active post (24-hour rotation)
      await connectDB()
      const publishedPosts = await Post.find({
        authorEmail: ADMIN_EMAIL,
        isPublished: true,
      }).sort({ publishedAt: 1 })

      if (publishedPosts.length === 0) {
        return NextResponse.json([])
      }

      // First check if any post is manually set as live
      const manuallyLivePost = publishedPosts.find((post) => post.isCurrentlyLive)

      if (manuallyLivePost) {
        return NextResponse.json([manuallyLivePost])
      }

      // Fall back to automatic rotation
      const newestPublishedDate = new Date(
        publishedPosts[publishedPosts.length - 1].publishedAt
      ).getTime()
      const now = Date.now()
      const daysPassed = Math.floor((now - newestPublishedDate) / (1000 * 60 * 60 * 24))

      // Start from the newest post and work backwards
      const currentPostIndex = publishedPosts.length - 1 - daysPassed

      // If we've gone past all posts, return empty array (triggers "no guidance" message)
      if (currentPostIndex < 0) {
        return NextResponse.json([])
      }

      const currentPost = publishedPosts[currentPostIndex]
      return NextResponse.json([currentPost])
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = authResult.email

    // Only admin can create posts
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, isPublished } = body

    await connectDB()

    const post = await Post.create({
      title: title || '',
      content,
      authorEmail: ADMIN_EMAIL,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
