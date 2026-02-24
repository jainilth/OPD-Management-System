import { generateToken } from "@/app/lib/jwt"
import { prisma } from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json()
        const user = await prisma.user.findUnique({
            where: { Username: username },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, Message: "invalid credentials" },
                { status: 401 }
            )
        }

        const valid = () => {
            if (password === user.Password) return 1;
            else return 0
        }

        if (!valid()) return NextResponse.json(
            { success: false, Message: "invalid credentials" },
            { status: 401 }
        )

        const role = await prisma.role.findUnique({
            where: { RoleID: user?.RoleID },
            select: {
                RoleName: true
            }
        })

        const token = generateToken({
            username: user.Username,
            userId: user.UserID,
            role: role?.RoleName
        })

        const response = NextResponse.json({
            sucess: true,
            message: "Login sucessful",
            token
        })

        response.cookies.set("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",   // VERY IMPORTANT
            maxAge: 60 * 60 * 24,

        });
        return response
    }
    catch {
        return NextResponse.json(
            { success: false, message: "Login Failed" },
            { status: 500 },
        )
    }
}