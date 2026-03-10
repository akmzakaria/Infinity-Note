import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 }
    )
  }
}
