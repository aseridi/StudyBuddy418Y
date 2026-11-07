import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from '@/lib/supabase/middleware'
import path from "path";

const protectedRoutes = ['/dashboard', '/update-password', '/courses', '/assignments', '/calendar']
const authRoutes = ['/login', '/signup', '/reset-password']

export async function proxy(request: NextRequest) {
    const { response, user } = await updateSession(request)
    const { pathname } = request.nextUrl

    if (protectedRoutes.some(r=> pathname.startsWith(r)) && !user) {
        const url = new URL('/login', request.url)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }
    if (authRoutes.some(r=> pathname.startsWith(r)) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}