import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "./lib/session"

const protectedRoute = ['/', '/hospital', '/doctor', '/diagnosis-type', '/treatment-type', '/sub-treatment-type', '/patient', '/opd', '/receipt', '/appointment']
const publicRoute = ['/login']

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoute.some(route => path === route || path.startsWith(route + '/'))
    const isPublicRoute = publicRoute.includes(path)

    const cookie = req.cookies.get("session")?.value
    const session = await decrypt(cookie)

    if (isProtectedRoute && !session?.username) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublicRoute && session?.username) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
