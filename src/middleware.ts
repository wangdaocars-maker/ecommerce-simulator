import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token')
  const isLoggedIn = !!sessionToken

  // 公开路径
  const publicPaths = ['/login', '/register', '/shop-register', '/api/auth']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // 如果未登录且访问受保护路径，重定向到登录页
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 如果已登录且访问登录/注册页，重定向到首页
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/products', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
}
