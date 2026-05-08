import { NextRequest, NextResponse } from 'next/server'

// Optimistic cookie check — actual session validation happens in Server Components
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/auth') || pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Check for any Supabase session cookie (sb-*-auth-token)
  const hasSession = request.cookies.getAll().some(c => c.name.includes('auth-token'))

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
