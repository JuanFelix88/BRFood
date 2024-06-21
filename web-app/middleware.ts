import { AuthToken } from "@/core/shared/entities/AuthToken"
import { MiddlewareConfig, NextFetchEvent, NextRequest, NextResponse } from "next/server"

const authRoutes = ["/api/v1/products", "/api/v1/products"]

export function isAuthenticatedRoute(request: NextRequest) {
  return authRoutes.some((authRoute) => request.nextUrl.pathname.startsWith(authRoute))
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
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
