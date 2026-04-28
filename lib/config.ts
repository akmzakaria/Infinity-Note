// Centralized configuration for user roles
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
export const VIEWER_EMAIL = process.env.VIEWER_EMAIL || ''

// Client-side safe versions (for use in components)
export const getAdminEmail = () =>
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''
export const getViewerEmail = () =>
  process.env.NEXT_PUBLIC_VIEWER_EMAIL || process.env.VIEWER_EMAIL || ''
