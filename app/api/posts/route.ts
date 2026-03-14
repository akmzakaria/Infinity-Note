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
        // First check if any post is manually set as live and still within 24 hours
        const manuallyLivePost = publishedPosts.find((post) => {
          if (!post.isCurrentlyLive) return false

          // Check if manual override is still valid (within 24 hours)
          const now = Date.now()
          const postUpdatedTime = new Date(post.updatedAt).getTime()
          const hoursSinceUpdate = (now - postUpdatedTime) / (1000 * 60 * 60)

          return hoursSinceUpdate < 24 // Manual override valid for 24 hours
        })

        if (manuallyLivePost) {
          currentlyActivePostId = manuallyLivePost._id.toString()
        } else {
          // Fall back to cycling rotation (1,2,3,4,5,1,2,3...)
          const firstPublishedDate = new Date(publishedPosts[0].publishedAt).getTime()
          const now = Date.now()
          const daysPassed = Math.floor((now - firstPublishedDate) / (1000 * 60 * 60 * 24))
          const currentPostIndex = daysPassed % publishedPosts.length

          currentlyActivePostId = publishedPosts[currentPostIndex]._id.toString()
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

      // First check if any post is manually set as live and still within 24 hours
      const manuallyLivePost = publishedPosts.find((post) => {
        if (!post.isCurrentlyLive) return false

        // Check if manual override is still valid (within 24 hours)
        const now = Date.now()
        const postUpdatedTime = new Date(post.updatedAt).getTime()
        const hoursSinceUpdate = (now - postUpdatedTime) / (1000 * 60 * 60)

        return hoursSinceUpdate < 24 // Manual override valid for 24 hours
      })

      if (manuallyLivePost) {
        return NextResponse.json([manuallyLivePost])
      }

      // Fall back to cycling rotation (1,2,3,4,5,1,2,3...)
      const firstPublishedDate = new Date(publishedPosts[0].publishedAt).getTime()
      const now = Date.now()
      const daysPassed = Math.floor((now - firstPublishedDate) / (1000 * 60 * 60 * 24))

      // Cycle through posts: day 0 = post 0, day 1 = post 1, etc.
      const currentPostIndex = daysPassed % publishedPosts.length

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
