import { SessionPlayload } from "@/lib/defination"
import { encrypt } from "@/lib/session"
import { NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

export async function POST(req: Request) {
    const { username, password } = await req.json()

    const res = await fetch(`${process.env.API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        }
    )

    if (!res.ok) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        )
    }

    const data = await res.json()

    // The backend only returns { token } — role and userId are inside the JWT
    const decoded: any = jwtDecode(data.token)

    const payload: SessionPlayload = {
        userId: decoded.userId || 0,
        username: decoded.username || username,
        role: decoded.role || "Admin",
        accessToken: data.token,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }

    const token = await encrypt(payload)

    const response = NextResponse.json({ success: true, role: payload.role })

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })

    return response
}
