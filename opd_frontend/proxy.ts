import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "./lib/session"

type AppRole = "Admin" | "Doctor" | "Patient" | "Receptionist" | "User"

const protectedRoute = ['/', '/hospital', '/department', '/doctor', '/specialization', '/diagnosis-type', '/treatment-type', '/sub-treatment-type', '/payment-mode', '/role', '/user', '/patient', '/opd', '/receipt', '/appointment', '/unauthorized']
const publicRoute = ['/login']

const routePermissions: Record<string, AppRole[]> = {
    '/': ["Admin", "Doctor", "Patient", "Receptionist", "User"],
    '/hospital': ["Admin"],
    '/department': ["Admin", "Receptionist"],
    '/doctor': ["Admin", "Doctor", "Receptionist"],
    '/specialization': ["Admin"],
    '/diagnosis-type': ["Admin", "Doctor", "Receptionist"],
    '/treatment-type': ["Admin", "Doctor", "Receptionist"],
    '/sub-treatment-type': ["Admin", "Doctor", "Receptionist"],
    '/payment-mode': ["Admin"],
    '/role': ["Admin"],
    '/user': ["Admin"],
    '/patient': ["Admin", "Doctor", "Receptionist"],
    '/opd': ["Admin", "Doctor", "Receptionist"],
    '/receipt': ["Admin", "Receptionist", "Patient", "User"],
    '/appointment': ["Admin", "Receptionist", "Patient"],
    '/unauthorized': ["Admin", "Doctor", "Patient", "Receptionist", "User"],
}

function getMatchedBaseRoute(path: string) {
    const routes = Object.keys(routePermissions).sort((a, b) => b.length - a.length)
    return routes.find((route) => path === route || path.startsWith(route + '/'))
}

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoute.some(route => path === route || path.startsWith(route + '/'))
    const isPublicRoute = publicRoute.includes(path)

    const cookie = req.cookies.get("session")?.value
    const session = await decrypt(cookie)

    if (isProtectedRoute && !session?.username) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isProtectedRoute && session?.username) {
        const role = session.role as AppRole
        const matchedRoute = getMatchedBaseRoute(path)
        if (matchedRoute) {
            const allowedRoles = routePermissions[matchedRoute]
            if (!allowedRoles.includes(role)) {
                return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
            }
        }
    }

    if (isPublicRoute && session?.username) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
