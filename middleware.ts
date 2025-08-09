import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get the auth token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If token exists, verify it
  if (token) {
    const payload = await verifyToken(token)

    // If token is invalid and trying to access protected route, redirect to login
    if (!payload && !isPublicRoute) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    // If valid token and trying to access auth pages, redirect to projects
    if (payload && isPublicRoute) {
      return NextResponse.redirect(new URL("/projects", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
