import { MiddlewareConfig, NextFetchEvent, NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { AuthToken } from "./src/shared/entities/AuthToken"

const authRoutes = ["/api/v1/products", "/api/v1/products"]

export function isAuthenticatedRoute(request: NextRequest) {
  return authRoutes.some((authRoute) =>
    request.nextUrl.pathname.startsWith(authRoute),
  )
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  console.time("request")
  if (isAuthenticatedRoute(request)) {
    if (!AuthToken.hasTokenNextRequest(request)) {
      return NextResponse.json(
        {
          errorMessage: "Unauthorized",
        },
        { status: 401 },
      )
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config: MiddlewareConfig = {
  matcher: "/api/:path*",
}
